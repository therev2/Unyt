'use client';

import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs, query, orderBy, increment as fsIncrement, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, ThumbsUp } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUserProfile } from '@/components/useUserProfile';

interface ForumTopic {
  id: string;
  title: string;
  description: string;
  category: string;
  author: {
    name: string;
    college: string;
    avatar: string;
  };
  createdAt: string;
  lastActivity: string;
  views: number;
  replies: number;
  isSticky: boolean;
  upvotes: number;
  upvotedBy?: string[];
}

interface ForumComment {
  id: string;
  author: {
    name: string;
    avatar: string;
    college: string;
  };
  content: string;
  createdAt: string;
}

export default function TopicDetailPage() {
  const { id } = useParams();
  const { userData } = useUserProfile();
  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');

  async function fetchTopicAndComments() {
    setLoading(true);
    // Increment views
    if (id) {
      const topicRef = doc(db, 'Discussion', id as string);
      await updateDoc(topicRef, { views: fsIncrement(1) });
    }
    // Fetch topic
    const topicRef = doc(db, 'Discussion', id as string);
    const topicSnap = await getDoc(topicRef);
    let topicData = null;
    if (topicSnap.exists()) {
      topicData = { id: topicSnap.id, ...topicSnap.data() } as ForumTopic;
      setTopic(topicData);
    }
    // Fetch comments (subcollection)
    try {
      const commentsCol = collection(db, 'Discussion', id as string, 'Comments');
      const q = query(commentsCol, orderBy('createdAt', 'asc'));
      const commentsSnap = await getDocs(q);
      const commentsData: ForumComment[] = commentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as ForumComment);
      setComments(commentsData);
    } catch (e) {
      setComments([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (id) fetchTopicAndComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleAddComment() {
    setAdding(true);
    setError('');
    try {
      if (!userData?.uid) throw new Error('You must be logged in to comment.');
      if (!newComment.trim()) throw new Error('Comment cannot be empty.');
      const commentsCol = collection(db, 'Discussion', id as string, 'Comments');
      await addDoc(commentsCol, {
        author: {
          name: userData.name || 'Anonymous',
          avatar: userData.avatar || '/placeholder.svg',
          college: userData.college || 'Unknown',
        },
        content: newComment,
        createdAt: serverTimestamp(),
        upvotes: 0,
      });
      // Increment the comments field in the parent topic doc
      const topicRef = doc(db, 'Discussion', id as string);
      await updateDoc(topicRef, { comments: fsIncrement(1) });
      setNewComment('');
      fetchTopicAndComments();
    } catch (e: any) {
      setError(e.message || 'Failed to add comment.');
    } finally {
      setAdding(false);
    }
  }

  // Format Firestore Timestamp for display
  function formatTimestamp(ts: any): string {
    if (!ts) return '';
    if (typeof ts === 'string') return ts;
    if (ts.seconds) {
      const date = new Date(ts.seconds * 1000);
      return date.toLocaleString();
    }
    return '';
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!topic) return <div className="p-8 text-center text-red-500">Topic not found.</div>;

  return (
    <div className="w-full min-h-screen bg-background px-2 md:px-8 lg:px-16 py-10 flex justify-center">
      <div className="w-full max-w-3xl">
        <Card className="w-full mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{topic.title}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge>{topic.category}</Badge>
              <span className="text-xs text-muted-foreground">{topic.createdAt}</span>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={topic.author.avatar} />
                <AvatarFallback>{topic.author.name[0]}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{topic.author.name}</span>
              <span className="text-xs text-muted-foreground">{topic.author.college}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 whitespace-pre-line">{topic.description}</div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1"><ThumbsUp className="h-4 w-4" />{topic.upvotes ?? 0} upvotes</div>
              <div className="flex items-center gap-1"><MessageCircle className="h-4 w-4" />{comments.length} comments</div>
              <div className="flex items-center gap-1">Views: {topic.views ?? 0}</div>
            </div>
          </CardContent>
        </Card>
        <div className="mt-8 w-full">
          <h2 className="font-semibold text-lg mb-2">Comments</h2>
          {comments.length === 0 ? (
            <div className="flex flex-col gap-4 items-center">
              <div className="text-muted-foreground">No comments found.</div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button disabled={!userData?.uid}>Add Comment</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add a Comment</DialogTitle>
                  </DialogHeader>
                  <Textarea
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Write your comment..."
                    rows={4}
                    className="mb-4"
                  />
                  {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
                  <DialogFooter>
                    <Button onClick={handleAddComment} disabled={adding || !userData?.uid}>
                      {adding ? 'Posting...' : 'Post Comment'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map(comment => (
                <Card key={comment.id} className="w-full">
                  <CardContent className="flex gap-3 items-start p-4">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={comment.author?.avatar || '/placeholder.svg'} />
                      <AvatarFallback>{comment.author?.name?.[0] || '?'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{comment.author?.name || 'Unknown'} <span className="text-xs text-muted-foreground ml-2">{comment.author?.college || ''}</span></div>
                      <div className="text-xs text-muted-foreground mb-1">{formatTimestamp(comment.createdAt)}</div>
                      <div className="whitespace-pre-line text-sm">{comment.content}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mt-2" disabled={!userData?.uid}>Add Comment</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add a Comment</DialogTitle>
                  </DialogHeader>
                  <Textarea
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Write your comment..."
                    rows={4}
                    className="mb-4"
                  />
                  {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
                  <DialogFooter>
                    <Button onClick={handleAddComment} disabled={adding || !userData?.uid}>
                      {adding ? 'Posting...' : 'Post Comment'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
