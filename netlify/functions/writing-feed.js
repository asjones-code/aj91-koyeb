const { XMLParser } = require("fast-xml-parser");

const CACHE_TTL_MS = 60 * 60 * 1000;
const FETCH_TIMEOUT_MS = 8000;
const MAX_ITEMS = 5;

const cache = new Map();

const RSS_SOURCES = {
  youtube: {
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCy1T4MetuPZMfHj-wGFIWHg",
    source: "YouTube",
  },
  substack: {
    url: "https://aj91.substack.com/feed",
    source: "Substack",
  },
  hashnode: {
    url: "https://aj91.hashnode.dev/rss.xml",
    source: "Hashnode",
  },
  goodgrow: {
    url: "https://www.goodgrow.io/projects/rss.xml",
    source: "GoodGrow",
  },
};

function getCached() {
  const cached = cache.get("writing-feed");
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }
  cache.delete("writing-feed");
  return null;
}

function setCache(data) {
  cache.set("writing-feed", {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

function truncate(str, max = 140) {
  if (!str || typeof str !== "string") return "";
  str = str.replace(/\s+/g, " ").trim();
  return str.length <= max ? str : str.slice(0, max - 1).trim() + "…";
}

function extractText(content) {
  if (typeof content === "string") return content;
  if (content?.["#text"]) return content["#text"];
  if (Array.isArray(content) && content[0]?.["#text"]) return content[0]["#text"];
  return "";
}

function extractImageFromHTML(htmlContent) {
  if (!htmlContent || typeof htmlContent !== "string") return "";
  let html = htmlContent;
  html = html.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x27;/g, "'").replace(/&amp;/g, "&");
  const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (ogImageMatch && ogImageMatch[1]) {
    let imgUrl = ogImageMatch[1].trim();
    if (imgUrl.startsWith("//")) imgUrl = "https:" + imgUrl;
    if (imgUrl.startsWith("http")) return imgUrl;
  }
  const imgPatterns = [
    /<img[^>]+src=["']([^"']+)["']/i,
    /<img[^>]+src=([^\s>]+)/i,
    /background-image:\s*url\(["']?([^"')]+)["']?\)/i,
  ];
  for (const pattern of imgPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      let imgUrl = match[1].trim();
      if (imgUrl.includes("&amp;")) imgUrl = imgUrl.replace(/&amp;/g, "&");
      if (imgUrl.startsWith("//")) imgUrl = "https:" + imgUrl;
      if (imgUrl.startsWith("http")) return imgUrl;
    }
  }
  return "";
}

function extractThumbnail(item, feedType) {
  if (feedType === "atom") {
    const mediaGroup = item["media:group"] || item.media?.group;
    if (mediaGroup) {
      const thumbnail = mediaGroup["media:thumbnail"] || mediaGroup.media?.thumbnail;
      if (thumbnail) {
        if (typeof thumbnail === "string") return thumbnail;
        if (thumbnail["@_url"]) return thumbnail["@_url"];
        if (thumbnail.url) return thumbnail.url;
        if (Array.isArray(thumbnail) && thumbnail[0]?.["@_url"]) return thumbnail[0]["@_url"];
      }
    }
    const link = item.link;
    if (link && typeof link === "object" && link["@_href"]) {
      const videoId = link["@_href"].match(/[?&]v=([^&]+)/)?.[1];
      if (videoId) return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }
  }
  if (feedType === "rss") {
    let contentEncoded = "";
    const contentEncodedRaw = item["content:encoded"] || item.content || "";
    if (typeof contentEncodedRaw === "string") {
      contentEncoded = contentEncodedRaw;
    } else if (contentEncodedRaw) {
      contentEncoded = contentEncodedRaw["__cdata"] || contentEncodedRaw["#text"] || extractText(contentEncodedRaw) || "";
    }
    if (contentEncoded && typeof contentEncoded === "string") {
      const imgFromContent = extractImageFromHTML(contentEncoded);
      if (imgFromContent) return imgFromContent;
    }
    let description = "";
    const descriptionRaw = item.description || item.summary || "";
    if (typeof descriptionRaw === "string") {
      description = descriptionRaw;
    } else if (descriptionRaw) {
      description = descriptionRaw["__cdata"] || descriptionRaw["#text"] || extractText(descriptionRaw) || "";
    }
    if (description && typeof description === "string") {
      const imgFromDesc = extractImageFromHTML(description);
      if (imgFromDesc) return imgFromDesc;
    }
    const enclosure = item.enclosure;
    if (enclosure) {
      const enclosureUrl = typeof enclosure === "string" ? enclosure : enclosure["@_url"] || enclosure.url;
      const enclosureType = enclosure["@_type"] || enclosure.type || "";
      if (enclosureUrl && enclosureType.startsWith("image/")) {
        return enclosureUrl;
      }
    }
    const mediaContent = item["media:content"] || item.media?.content;
    if (mediaContent) {
      const contentUrl = typeof mediaContent === "string" ? mediaContent : mediaContent["@_url"] || mediaContent.url;
      const contentType = mediaContent["@_type"] || mediaContent.type || "";
      if (contentUrl && contentType.startsWith("image/")) {
        return contentUrl;
      }
    }
    const thumbnail = item["media:thumbnail"] || item.media?.thumbnail;
    if (thumbnail) {
      if (typeof thumbnail === "string") return thumbnail;
      if (thumbnail["@_url"]) return thumbnail["@_url"];
      if (thumbnail.url) return thumbnail.url;
    }
  }
  return "";
}

function normalizeYouTubeItem(item) {
  const title = extractText(item.title || "");
  const link = item.link;
  let url = "";
  let videoId = "";
  if (Array.isArray(link)) {
    const videoLink = link.find((l) => {
      const href = typeof l === "string" ? l : l?.["@_href"] || l?.["@_rel"] === "alternate" ? l?.["@_href"] : null;
      return href && href.includes("watch?v=");
    });
    if (videoLink) {
      url = typeof videoLink === "string" ? videoLink : videoLink["@_href"] || "";
      videoId = url.match(/[?&]v=([^&]+)/)?.[1];
    }
  } else if (typeof link === "string") {
    url = link;
    videoId = link.match(/[?&]v=([^&]+)/)?.[1];
  } else if (link?.["@_href"]) {
    url = link["@_href"];
    videoId = url.match(/[?&]v=([^&]+)/)?.[1];
  }
  const ytVideoId = item["yt:videoId"] || item.yt?.videoId;
  if (ytVideoId) {
    videoId = ytVideoId;
    if (!url) url = `https://www.youtube.com/watch?v=${videoId}`;
  }
  if (!url && videoId) url = `https://www.youtube.com/watch?v=${videoId}`;
  const published = extractText(item.published || item.pubDate || item.updated || "");
  const mediaGroup = item["media:group"] || item.media?.group;
  let description = "";
  if (mediaGroup) {
    description = extractText(mediaGroup["media:description"] || mediaGroup.media?.description || "");
  }
  if (!description) {
    description = extractText(item.summary || item.content || item.description || "");
  }
  description = description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  let thumbnail = extractThumbnail(item, "atom");
  if (!thumbnail && videoId) {
    thumbnail = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  }
  return {
    source: "YouTube",
    title: title || "Video",
    excerpt: truncate(description) || "Latest video",
    url: url || "",
    thumbnail: thumbnail || "",
    publishedAt: published || "",
  };
}

function normalizeRSSItem(item, source) {
  const title = extractText(item.title || "");
  const link = item.link;
  let url = "";
  if (typeof link === "string") {
    url = link;
  } else if (link?.["@_href"]) {
    url = link["@_href"];
  } else if (Array.isArray(link) && link[0]) {
    url = typeof link[0] === "string" ? link[0] : link[0]["@_href"] || "";
  }
  const published = extractText(item.pubDate || item.published || item["dc:date"] || "");
  const contentEncodedRaw = item["content:encoded"] || item.content || "";
  let contentEncoded = "";
  if (typeof contentEncodedRaw === "string") {
    contentEncoded = contentEncodedRaw;
  } else if (contentEncodedRaw) {
    contentEncoded = contentEncodedRaw["__cdata"] || contentEncodedRaw["#text"] || extractText(contentEncodedRaw) || "";
  }
  const descriptionRaw = item.description || item.summary || "";
  let descriptionRawText = "";
  if (typeof descriptionRaw === "string") {
    descriptionRawText = descriptionRaw;
  } else if (descriptionRaw) {
    descriptionRawText = descriptionRaw["__cdata"] || descriptionRaw["#text"] || extractText(descriptionRaw) || "";
  }
  let description = contentEncoded || descriptionRawText || "";
  description = description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  let thumbnail = extractThumbnail(item, "rss");
  if (source === "Hashnode" && thumbnail && !thumbnail.startsWith("http")) {
    thumbnail = "https://aj91.hashnode.dev" + (thumbnail.startsWith("/") ? "" : "/") + thumbnail;
  }
  return {
    source,
    title: title || "Article",
    excerpt: truncate(description) || `Latest from ${source}`,
    url: url || "",
    thumbnail: thumbnail || "",
    publishedAt: published || "",
  };
}

async function fetchRSSFeed(sourceKey, sourceConfig) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(sourceConfig.url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; WritingFeed/1.0; +https://aj91.dev)",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      return [];
    }
    const xmlText = await response.text();
    if (!xmlText || xmlText.length < 100) {
      return [];
    }
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      textNodeName: "#text",
      parseAttributeValue: false,
      parseTagValue: true,
      trimValues: false,
      ignoreNameSpace: false,
      removeNSPrefix: false,
      parseTrueNumberOnly: false,
      arrayMode: false,
      alwaysCreateTextNode: true,
      preserveOrder: false,
      cdataTagName: "__cdata",
      cdataPositionChar: "\\c",
      processEntities: true,
      isArray: (name, jPath, isLeafNode, isAttribute) => {
        if (name === "item" || name === "entry") return true;
        if (name === "link" && jPath.includes("feed")) return true;
        return false;
      },
    });
    let parsed;
    try {
      parsed = parser.parse(xmlText);
    } catch (parseError) {
      return [];
    }
    if (!parsed) return [];
    const feed = parsed.feed || parsed.rss?.channel;
    if (!feed) return [];
    let items = feed.entry || feed.item || [];
    if (!Array.isArray(items)) {
      items = items ? [items] : [];
    }
    if (items.length === 0) return [];
    const firstItem = items[0];
    if (!firstItem) return [];
    if (sourceKey === "youtube") {
      const normalized = normalizeYouTubeItem(firstItem);
      if (!normalized.url) return [];
      return [normalized];
    }
    const normalized = normalizeRSSItem(firstItem, sourceConfig.source);
    if (!normalized.url) return [];
    return [normalized];
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      return [];
    }
    return [];
  }
}

async function fetchAllFeeds() {
  const results = await Promise.allSettled(
    Object.entries(RSS_SOURCES).map(([key, config]) => fetchRSSFeed(key, config))
  );
  const allItems = [];
  for (const result of results) {
    if (result.status === "fulfilled" && Array.isArray(result.value) && result.value.length > 0) {
      allItems.push(...result.value);
    }
  }
  return allItems;
}

function sortByDate(items) {
  return [...items].sort((a, b) => {
    const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return dateB - dateA;
  });
}

exports.handler = async (event, context) => {
  const cached = getCached();
  if (cached) {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=600",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "X-Cache": "HIT",
      },
      body: JSON.stringify(cached),
    };
  }
  const items = await fetchAllFeeds();
  const sorted = sortByDate(items);
  const result = sorted.slice(0, MAX_ITEMS);
  setCache(result);
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=600",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "X-Cache": "MISS",
    },
    body: JSON.stringify(result),
  };
};
