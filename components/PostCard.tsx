import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link to={`/article/${post.id}`}>
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity" 
        />
        <div className="p-5">
          <h2 className="text-xl font-display font-bold text-secondary mb-2 group-hover:text-link transition-colors line-clamp-2" style={{ minHeight: '3.5rem' }}>
            {post.title}
          </h2>
          <p className="text-text-muted text-sm mb-4 line-clamp-2" style={{ minHeight: '2.5rem' }}>
            {post.deck}
          </p>
          <div className="text-right">
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
