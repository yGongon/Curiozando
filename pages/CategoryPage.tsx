import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { Post } from '../types';
import { getPosts } from '../services/firebase';
import LoadingSpinner from '../components/LoadingSpinner';

const slugToCategory = (slug: string = '') => {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const CategoryPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [allPosts, setAllPosts] = useState<Post[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 12;

    const categoryName = slug ? slugToCategory(slug) : 'Categoria';

    useEffect(() => {
        document.title = `${categoryName} - Curiozando`;
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const fetchedPosts = await getPosts();
                setAllPosts(fetchedPosts);
            } catch (err) {
                setError("Falha ao carregar os posts. Tente novamente mais tarde.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [categoryName]);

    useEffect(() => {
        if (allPosts.length > 0) {
            const results = allPosts.filter(post => post.category === categoryName);
            setFilteredPosts(results);
            setCurrentPage(1); // Reset page on category change
        }
    }, [allPosts, categoryName]);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const paginate = (pageNumber: number) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    }

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

    return (
        <div>
            <h1 className="text-4xl font-display font-bold text-secondary mb-8 border-b-2 border-primary pb-4">
                Categoria: {categoryName}
            </h1>

            {filteredPosts.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentPosts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <nav className="mt-10 flex justify-center">
                            <ul className="flex items-center -space-x-px h-10 text-base">
                                <li>
                                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50">Anterior</button>
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
                </>
            ) : (
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-secondary">Nenhum post encontrado nesta categoria.</h2>
                    <p className="text-text-muted mt-2">Em breve teremos novos conteúdos aqui!</p>
                </div>
            )}
        </div>
    );
};

export default CategoryPage;
