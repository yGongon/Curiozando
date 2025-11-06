import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Post } from '../types';
import { getPost, formatFirebaseTimestamp } from '../services/firebase';
import LoadingSpinner from '../components/LoadingSpinner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MessageCircle, Twitter, Facebook } from 'lucide-react';
import PostCard from '../components/PostCard';


const AdPlaceholder: React.FC<{ width: number; height: number; label: string }> = ({ width, height, label }) => (
  <div
    className="bg-gray-200 flex items-center justify-center text-gray-500 my-8 mx-auto"
    style={{ width: `min(100%, ${width}px)`, height: `${height}px` }}
  >
    {label} ({width}x{height})
  </div>
);

const categorySlug = (categoryName: string = 'curiosidades') =>
  categoryName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

const ArticlePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            if (!id) {
                setError("ID do post inválido.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const fetchedPost = await getPost(id);
                if (fetchedPost) {
                    setPost(fetchedPost);
                } else {
                    setError("Post não encontrado.");
                }
            } catch (err) {
                setError("Falha ao carregar o post.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);
    
    useEffect(() => {
        if (post) {
            document.title = `${post.title} - Curiozando`;
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', post.deck);
            }
        }
    }, [post]);

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
    if (!post) return <div className="text-center py-20">Post não encontrado.</div>;


    return (
        <article className="max-w-3xl mx-auto">
            <header className="mb-8">
                <Link to={`/category/${categorySlug(post.category)}`} className="text-md font-bold text-primary uppercase tracking-wider mb-2 inline-block hover:underline">
                    {post.category}
                </Link>
                <h1 className="text-3xl md:text-5xl font-display font-bold text-secondary my-3 leading-tight">
                    {post.title}
                </h1>
                <p className="text-xl text-text-muted italic my-4">{post.deck}</p>
                <p className="text-text-muted">{formatFirebaseTimestamp(post.createdAt)}</p>
            </header>
            
            <img src={post.imageUrl} alt={post.title} className="w-full rounded-lg shadow-lg mb-8" />
            
             <AdPlaceholder width={728} height={90} label="Anúncio no Artigo" />

            <div className="prose prose-lg max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
            </div>

            {/* Ad at the end of the article */}
            <AdPlaceholder width={728} height={90} label="Anúncio Final" />

            {/* Share buttons */}
            <div className="flex items-center justify-center space-x-4 my-8">
                <span className="font-bold text-secondary">Compartilhe:</span>
                <a href="#" aria-label="Share on Facebook" className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"><Facebook size={20} /></a>
                <a href="#" aria-label="Share on Twitter" className="p-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"><Twitter size={20} /></a>
                <a href="#" aria-label="Share on WhatsApp" className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"><MessageCircle size={20} /></a>
            </div>
        </article>
    );
};

export default ArticlePage;