import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiHeaders, getUser } from '../utils/auth';

export default function ArticleView(){
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const user = getUser();
  const nav = useNavigate();

  const fetchArticle = async () => {
    const resp = await fetch(`https://assesment-vikash-1.onrender.com/articles/${id}`, { headers: apiHeaders() });
    const data = await resp.json();
    setArticle(data);
  };

  useEffect(()=> { fetchArticle(); }, [id]);

  const handleSummarize = async () => {
    setLoadingSummary(true);
    try {
      const resp = await fetch(`https://assesment-vikash-1.onrender.com/${id}/summarize`, {
        method: 'POST',
        headers: apiHeaders(),
        body: JSON.stringify({ provider: 'openai' }) // or 'gemini'
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || 'Summarize failed');
      setArticle(data.article || {...article, summary: data.summary});
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete article?')) return;
    const resp = await fetch(`https://assesment-vikash-1.onrender.com/articles/${id}`, {
      method: 'DELETE', headers: apiHeaders()
    });
    if (resp.ok) {
      alert('Deleted');
      nav('/');
    } else {
      alert('Delete failed');
    }
  };

  if (!article) return <div>Loading...</div>;

  const isOwner = article.createdBy && (article.createdBy._id === user.id);
  const canEdit = isOwner || user.role === 'admin';

  return (
    <div>
      <h2>{article.title}</h2>
      <div>By: {article.createdBy?.name}</div>
      <div>Tags: {article.tags?.join(', ')}</div>
      <hr/>
      <div style={{whiteSpace:'pre-wrap'}}>{article.content}</div>
      <hr/>
      <div>
        <h3>Summary</h3>
        <div>{article.summary || <em>No summary yet</em>}</div>
        <button onClick={handleSummarize} disabled={loadingSummary}>{loadingSummary ? 'Summarizing...' : 'Summarize'}</button>
      </div>

      <div>
        {canEdit && <Link to={`/edit/${article._id}`}><button>Edit</button></Link>}
        {user.role === 'admin' && <button onClick={handleDelete}>Delete (admin)</button>}
      </div>
    </div>
  );
}
