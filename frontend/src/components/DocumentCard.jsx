function DocumentCard({ title, author, category }) {
  return (
    <div className="document-card">
      <span className="document-category">{category}</span>
      <h3 className="document-title">{title}</h3>
      <p className="document-author">By {author}</p>
    </div>
  );
}

export default DocumentCard;
