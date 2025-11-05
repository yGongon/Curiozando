import React, { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import { Post } from '../types';
import { getPosts } from '../services/firebase';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Mail } from 'lucide-react';

const AdPlaceholder: React.FC<{ width: number; height: number; label: string }> = ({ width, height, label }) => (
  <div
    className="bg-gray-200 flex items-center justify-center text-gray-500 mx-auto"
    style={{ width: `min(100%, ${width}px)`, height: `${height}px` }}
  >
    {label} ({width}x{height})
  </div>
);

const HomePage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 12;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const fetchedPosts = await getPosts();
                setPosts(fetchedPosts);
            } catch (err) {
                setError("Falha ao carregar os posts. Tente novamente mais tarde.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const totalPages = Math.ceil(posts.length / postsPerPage);

    const paginate = (pageNumber: number) => {
      if (pageNumber < 1 || pageNumber > totalPages) return;
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    }
    
    const mostReadPosts = posts.slice(0, 5);

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

    return (
        <div>
            {/* Top Banner Ad */}
            <div className="mb-8 flex justify-center">
                <AdPlaceholder width={728} height={90} label="Anúncio Topo" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <input
                          type="text"
                          placeholder="Buscar curiosidades..."
                          className="w-full py-3 pl-4 pr-10 border-2 border-gray-200 rounded-full focus:outline-none focus:border-primary transition-colors"
                        />
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>

                    {/* Articles Grid */}
                    {posts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {currentPosts.map(post => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 col-span-2">
                            <h2 className="text-2xl font-bold text-secondary">Nenhum post encontrado.</h2>
                            <p className="text-text-muted mt-2">Que tal gerar o primeiro no painel de admin?</p>
                        </div>
                    )}


                    {/* Pagination */}
                    {totalPages > 1 && (
                      <nav className="mt-10 flex justify-center">
                          <ul className="flex items-center -space-x-px h-10 text-base">
                              <li>
                                  <button onClick={() => paginate(currentPage - 1)}  disabled={currentPage === 1} className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50">Anterior</button>
                              </li>
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                  <li key={number}>
                                      <button
                                          onClick={() => paginate(number)}
                                          className={`flex items-center justify-center px-4 h-10 leading-tight ${currentPage === number ? 'bg-primary text-secondary font-bold' : 'bg-white text-gray-500 hover:bg-gray-100'} border border-gray-300`}
                                      >
                                          {number}
                                      </button>
                                  </li>
                              ))}
                              <li>
                                  <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50">Próximo</button>
                              </li>
                          </ul>
                      </nav>
                    )}
                </div>

                {/* Sidebar */}
                <aside className="lg:col-span-1 space-y-8">
                    {/* Sidebar Ad */}
                    <div className="flex justify-center lg:justify-start">
                         <AdPlaceholder width={300} height={250} label="Anúncio Lateral" />
                    </div>

                    {/* Most Read */}
                    {mostReadPosts.length > 0 && (
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="font-display text-xl font-bold text-secondary mb-4 border-b-2 border-primary pb-2">Mais Lidas</h3>
                            <ul className="space-y-3">
                                {mostReadPosts.map(post => (
                                    <li key={post.id}>
                                        <a href={`#/article/${post.id}`} className="text-text-muted hover:text-link font-semibold transition-colors line-clamp-2">
                                            {post.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Newsletter */}
                    <div className="bg-secondary text-white p-6 rounded-lg text-center">
                        <Mail size={40} className="mx-auto text-primary mb-3" />
                        <h3 className="font-display text-xl font-bold mb-2">Junte-se ao Curiozando!</h3>
                        <p className="text-sm text-gray-300 mb-4">Receba as melhores curiosidades direto no seu e-mail.</p>
                        <form className="flex flex-col space-y-3">
                            <input type="email" placeholder="Seu melhor e-mail" className="w-full px-4 py-2 rounded border-0 text-secondary focus:outline-none focus:ring-2 focus:ring-primary" />
                            <button type="submit" className="w-full bg-primary text-secondary font-bold py-2 rounded hover:bg-yellow-400 transition-colors">Inscrever</button>
                        </form>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default HomePage;
