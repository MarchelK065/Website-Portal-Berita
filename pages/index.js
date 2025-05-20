// pages/index.js

import axios from 'axios';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export async function getServerSideProps(context) {
  const newsApiKey = process.env.NEWS_API_KEY;
  const query = context.query.q || '';
  const category = context.query.category || '';

  let newsApiUrl;
  if (query) {
    newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${newsApiKey}`;
  } else {
    newsApiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${newsApiKey}`;
    if (category) {
      newsApiUrl += `&category=${category}`;
    }
  }

  let newsData = [];
  let error = null;

  try {
    const response = await axios.get(newsApiUrl);
    newsData = response.data.articles;
  } catch (err) {
    console.error("Error fetching news:", err.message);
    error = "Failed to fetch news. Please try again later.";
    if (err.response && err.response.data) {
      console.error("News API Error Details:", err.response.data);
      error = `Failed to fetch news: ${err.response.data.message || err.response.statusText || err.message}`;
    }
  }

  return {
    props: {
      newsData: newsData,
      error: error,
      initialQuery: query,
      initialCategory: category,
    },
  };
}

export default function Home({ newsData, error, initialQuery, initialCategory }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialQuery || '');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || '');

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    if (status === 'unauthenticated' && status !== 'loading') {
      router.push('/login');
    }
  }, [status, router]);

  const handleSearch = () => {
    router.push({
      pathname: '/',
      query: {
        q: searchQuery,
        category: selectedCategory,
      },
    });
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    router.push({
      pathname: '/',
      query: {
        q: searchQuery,
        category: newCategory,
      },
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Tanggal tidak tersedia';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    try {
      return new Date(dateString).toLocaleDateString('id-ID', options);
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return 'Tanggal tidak valid';
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-medium-blue">
        <p className="text-lg font-semibold text-dark-blue">Loading session...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-600 bg-red-100 border border-red-400 rounded-md">
        Error: {error}
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-medium-blue p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-lg mb-4 text-gray-700">Anda perlu login untuk melihat berita.</p>
          <button
            onClick={() => signIn('google')}
            className="bg-medium-blue hover:bg-dark-blue text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-medium-blue focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            Login dengan Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg mt-8 border-2 border-dark-blue">
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-bold text-dark-blue font-rowdies">
          MARC PORTAL
        </h1>
      </div>

      <div className="flex justify-between items-center mb-6 pb-4 border-b border-light-gray">
        {session && (
          <div className="text-dark-blue">
            <p className="text-xl font-semibold">Selamat datang, {session.user.name}!</p>
            {initialQuery && <p className="text-sm text-dark-blue mt-1">Menampilkan hasil pencarian untuk: <strong>{initialQuery}</strong></p>}
            {initialCategory && <p className="text-sm text-dark-blue">Filter Kategori: <strong>{initialCategory}</strong></p>}
          </div>
        )}
        <button
          onClick={() => signOut()}
          className="bg-orange-accent hover:bg-dark-blue text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-accent focus:ring-opacity-50 transition duration-150 ease-in-out"
        >
          Logout
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between mb-8 space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex w-full md:w-auto space-x-2">
          <input
            type="text"
            placeholder="Cari berita..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            className="flex-grow px-4 py-2 border border-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-medium-blue"
          />
          <button
            onClick={handleSearch}
            className="bg-medium-blue hover:bg-dark-blue text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-medium-blue focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            Cari
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="category-filter" className="text-dark-blue font-medium">Filter Kategori:</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="px-4 py-2 border border-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-medium-blue"
          >
            <option value="">Semua Kategori</option>
            <option value="business">Bisnis</option>
            <option value="entertainment">Hiburan</option>
            <option value="general">Umum</option>
            <option value="health">Kesehatan</option>
            <option value="science">Sains</option>
            <option value="sports">Olahraga</option>
            <option value="technology">Teknologi</option>
          </select>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-dark-blue">Berita Terbaru</h2>

      {newsData && newsData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsData.map((article, index) => (
            <div key={index} className="border border-light-gray rounded-lg p-4 shadow-sm hover:shadow-md transition duration-150 ease-in-out flex flex-col">
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <h3 className="text-lg font-semibold mb-2 text-dark-blue">{article.title}</h3>

              {article.publishedAt && (
                <p className="text-gray-500 text-xs mb-2">
                  Dipublikasikan: {formatDate(article.publishedAt)}
                </p>
              )}

              <p className="text-gray-600 text-sm mb-4 flex-grow">{article.description}</p>
              {article.url && (
                <p className="text-medium-blue hover:underline text-sm mt-auto">
                  <a href={`/article?title=${encodeURIComponent(article.title || '')}&description=${encodeURIComponent(article.description || '')}&content=${encodeURIComponent(article.content || '')}&urlToImage=${encodeURIComponent(article.urlToImage || '')}&url=${encodeURIComponent(article.url || '')}&sourceName=${encodeURIComponent(article.source?.name || '')}&author=${encodeURIComponent(article.author || '')}&publishedAt=${encodeURIComponent(article.publishedAt || '')}`}
                    rel="noopener noreferrer"
                  >
                    Baca Selengkapnya
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-dark-blue">Tidak ada berita yang tersedia saat ini.</div>
      )}
    </div>
  );
}