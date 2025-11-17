import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  keywords?: string;
  author?: string;
  schema?: Record<string, any>;
}

export function SEO({
  title,
  description,
  canonical,
  ogImage = '/logo.png',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  keywords,
  author = 'Sigma72HQ',
  schema,
}: SEOProps) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    const metaTags: Array<{ name?: string; property?: string; content: string }> = [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: ogType },
      { property: 'og:image', content: ogImage },
      { name: 'twitter:card', content: twitterCard },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage },
    ];

    if (keywords) {
      metaTags.push({ name: 'keywords', content: keywords });
    }

    if (author) {
      metaTags.push({ name: 'author', content: author });
    }

    if (canonical) {
      metaTags.push({ property: 'og:url', content: canonical });
    }

    const addedElements: Element[] = [];

    metaTags.forEach(({ name, property, content }) => {
      const meta = document.createElement('meta');
      if (name) meta.setAttribute('name', name);
      if (property) meta.setAttribute('property', property);
      meta.setAttribute('content', content);
      meta.setAttribute('data-seo', 'true');
      document.head.appendChild(meta);
      addedElements.push(meta);
    });

    let canonicalLink: HTMLLinkElement | null = null;
    if (canonical) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      canonicalLink.href = canonical;
      canonicalLink.setAttribute('data-seo', 'true');
      document.head.appendChild(canonicalLink);
      addedElements.push(canonicalLink);
    }

    let schemaScript: HTMLScriptElement | null = null;
    if (schema) {
      schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.textContent = JSON.stringify(schema);
      schemaScript.setAttribute('data-seo', 'true');
      document.head.appendChild(schemaScript);
      addedElements.push(schemaScript);
    }

    return () => {
      document.title = previousTitle;
      addedElements.forEach(el => el.remove());
    };
  }, [title, description, canonical, ogImage, ogType, twitterCard, keywords, author, schema]);

  return null;
}
