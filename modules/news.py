import feedparser
from config import NEWS_FEED_URL

def fetch_news(limit: int = 10) -> list[dict]:
    """
    Fetch latest cybersecurity news from RSS feed.
    Returns list of dicts: title, link, summary, published.
    """
    feed = feedparser.parse(NEWS_FEED_URL)
    entries = feed.entries[:limit]
    news_items = []
    for entry in entries:
        news_items.append({
            "title": entry.get("title", "No title"),
            "link": entry.get("link", ""),
            "summary": entry.get("summary", "No summary"),
            "published": entry.get("published", "Unknown"),
        })
    return news_items
