
'use client';
import type { Comment } from '@/lib/types';
import CommentCard from './comment-card';

type CommentListProps = {
    comments: Comment[];
};

export default function CommentList({ comments }: CommentListProps) {
    if (!comments || comments.length === 0) {
        return (
            <div className="text-center py-8 text-white/60">
                <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
        );
    }
    return (
        <div className="divide-y divide-white/10">
            {comments.map(comment => (
                <CommentCard key={comment.id} comment={comment} />
            ))}
        </div>
    );
}
