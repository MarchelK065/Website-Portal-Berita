import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function ArticleDetail() {
  const router = useRouter();
  const { title, description, content, urlToImage, url, sourceName, author, publishedAt } = router.query;
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated' && status !== 'loading') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-medium-blue">
        <p className="text-lg font-semibold text-dark-blue">Loading session...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

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

  if (!title) {
    return (
      <div className="container mx-auto p-4 text-center text-gray-700">
        <p>Data artikel tidak ditemukan.</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 bg-medium-blue hover:bg-dark-blue text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-medium-blue focus:ring-opacity-50 transition duration-150 ease-in-out"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg mt-8 border-2 border-dark-blue">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-dark-blue">{title}</h1>

      <div className="text-gray-600 text-sm mb-6 border-b pb-4 border-light-gray">
        {sourceName && <p>Sumber: {sourceName}</p>}
        {author && <p>Penulis: {author}</p>}
        {publishedAt && <p>Dipublikasikan: {formatDate(publishedAt)}</p>}
      </div>

      {urlToImage && (
        <img
          src={urlToImage}
          alt={title}
          className="w-full object-contain rounded-md mb-6"
        />
      )}

      {description && (
        <p className="text-gray-700 text-base mb-6">{description}</p>
      )}

      {content && (
        <div className="text-gray-800 text-base mb-6">
          <p>{content}</p>
        </div>
      )}

      {url && (
        <p className="text-medium-blue hover:underline text-sm mt-4">
          <a href={url} target="_blank" rel="noopener noreferrer">
            Baca Artikel Asli di Sumber
          </a>
        </p>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={() => router.push('/')}
          className="bg-medium-blue hover:bg-dark-blue text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-medium-blue focus:ring-opacity-50 transition duration-150 ease-in-out"
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}