import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

const categorySlug = (categoryName: string = 'curiosidades') =>
  categoryName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');


const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
      <Link to={`/article/${post.id}`} className="flex flex-col flex-grow">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity" 
        />
        <div className="p-5 flex flex-col flex-grow">
          <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
            {post.category}
          </p>
          <h2 className="text-xl font-display font-bold text-secondary mb-2 group-hover:text-link transition-colors line-clamp-2" style={{ minHeight: '3.5rem' }}>
            {post.title}
          </h2>
          <p className="text-text-muted text-sm mb-4 line-clamp-2 flex-grow" style={{ minHeight: '2.5rem' }}>
            {post.deck}
          </p>
          <div className="text-right mt-auto">
             <span className="font-bold text-sm text-link group-hover:underline">
              Leia mais &rarr;
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PostCard;