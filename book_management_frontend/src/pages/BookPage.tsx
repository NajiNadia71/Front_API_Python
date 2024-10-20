import React from 'react';
import { Books } from '../components/Book';

const BookPage: React.FC = () => {
  return (
    <div>
      <h1>Manage Book</h1>
      <Books />
    </div>
  );
};

export default BookPage;