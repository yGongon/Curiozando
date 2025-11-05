import React, { useState, useEffect, useCallback } from 'react';
import { generateBlogPostContent, generateBlogImage } from '../services/geminiService';
import { getPosts, addPost, deletePost, updatePost, formatFirebaseTimestamp } from '../services/firebase';
import { Post } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface GeneratedPostData {
  title: string;
  deck: string;
  content: string;
  imageUrl: string;
  sources: Array<{ title: string; uri: string; }>;
}

const AdminDashboard: React.FC = () => {
  const [theme, setTheme] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [generatedPost, setGeneratedPost] = useState<GeneratedPostData | null>(null);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
        const postsData = await getPosts();
        setPosts(postsData);
    } catch (err) {
        setError('Failed to fetch posts.');
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleGenerate = async () => {
    if (!theme.trim()) {
      setError('Please enter a theme for the blog post.');
      return;
    }
    setLoading(true);
    setError(null);
    setGeneratedPost(null);

    try {
      const content = await generateBlogPostContent(theme);
      const imageUrl = await generateBlogImage(content.title);
      setGeneratedPost({ ...content, imageUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during generation.');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedPost) return;
    setPublishing(true);
    setError(null);
    try {
      await addPost(generatedPost);
      setGeneratedPost(null);
      setTheme('');
      await fetchPosts();
    } catch (err) {
      setError('Failed to publish post.');
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
        try {
            await deletePost(id);
            await fetchPosts();
        } catch (err) {
            setError('Failed to delete post.');
        }
    }
  };

  const handleEditSave = async () => {
    if (!editingPost) return;
    try {
        await updatePost(editingPost.id, { title: editingPost.title, deck: editingPost.deck, content: editingPost.content });
        setEditingPost(null);
        await fetchPosts();
    } catch (err) {
        setError('Failed to update post.');
    }
  };


  return (
    <div className="space-y-12">
      <h1 className="text-4xl font-bold font-display text-secondary">Admin Dashboard</h1>
      
      {/* Post Generator Section */}
      <section className="bg-gray-50 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold font-display text-secondary mb-4">Gerar Novo Post</h2>
        <div className="space-y-4">
          <textarea
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="Digite um tema ou tópico para a IA escrever... ex: 'A história surpreendente do garfo'"
            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition-all h-24"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full md:w-auto bg-primary text-secondary font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading && <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-secondary mr-2"></div>}
            {loading ? 'Gerando...' : 'Gerar com IA'}
          </button>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </section>

      {/* Generated Post Preview */}
      {generatedPost && (
        <section className="bg-gray-50 p-8 rounded-lg shadow-lg space-y-6">
          <h2 className="text-3xl font-bold font-display">Pré-visualização</h2>
          <article>
            <img src={generatedPost.imageUrl} alt="Generated" className="w-full h-auto max-h-96 object-cover rounded-lg mb-6"/>
            <h3 className="text-4xl font-display font-bold mb-2">{generatedPost.title}</h3>
            <p className="text-xl text-text-muted italic mb-4">{generatedPost.deck}</p>
            <div className="prose max-w-none bg-white p-4 rounded border">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{generatedPost.content}</ReactMarkdown>
            </div>
          </article>
          
          {generatedPost.sources && generatedPost.sources.length > 0 && (
            <div className="mt-6">
                <h4 className="text-xl font-bold font-display mb-2">Fontes Pesquisadas</h4>
                <ul className="list-disc list-inside space-y-1 bg-white p-4 rounded border text-sm">
                    {generatedPost.sources.map((source, index) => (
                        <li key={index}>
                            <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-link hover:underline break-all" title={source.uri}>
                                {source.title || source.uri}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
          )}

          <button
            onClick={handlePublish}
            disabled={publishing}
            className="w-full md:w-auto bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {publishing ? 'Publicando...' : 'Publicar Post'}
          </button>
        </section>
      )}

      {/* Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4 text-secondary">Editar Post</h2>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input 
                    type="text" 
                    value={editingPost.title}
                    onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg mb-4"
                />
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo (Deck)</label>
                <input 
                    type="text"
                    value={editingPost.deck}
                    onChange={(e) => setEditingPost({...editingPost, deck: e.target.value})}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg mb-4"
                    placeholder="Um subtítulo conciso e atraente"
                />
                <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo (Markdown)</label>
                <textarea 
                    value={editingPost.content}
                    onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg h-96"
                />
                <div className="flex justify-end space-x-4 mt-4">
                    <button onClick={() => setEditingPost(null)} className="bg-gray-200 px-4 py-2 rounded">Cancelar</button>
                    <button onClick={handleEditSave} className="bg-primary text-secondary font-bold px-4 py-2 rounded">Salvar</button>
                </div>
            </div>
        </div>
      )}

      {/* Existing Posts Section */}
      <section>
        <h2 className="text-2xl font-bold font-display text-secondary mb-4">Posts Existentes</h2>
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center flex-wrap">
              <div className="flex-grow">
                <h3 className="font-bold text-lg">{post.title}</h3>
                <p className="text-sm text-text-muted">{formatFirebaseTimestamp(post.createdAt)}</p>
              </div>
              <div className="flex space-x-2 mt-2 md:mt-0">
                <button onClick={() => setEditingPost(post)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm">Editar</button>
                <button onClick={() => handleDelete(post.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">Deletar</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
