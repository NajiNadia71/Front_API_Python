import json
import http.server
import socketserver
from urllib.parse import urlparse, parse_qs
from book_type import (
    create_book_type,
    list_book_types,
    get_book_type,
    update_book_type,
    delete_book_type,
    inital_book_types
)
from book import (  inital_books,
                  create_book,
    list_books,
    get_book,
    update_book,
    delete_book,
    inital_books)
# Initialize the mock database

PORT = 8000

class MyRequestHandler(http.server.SimpleHTTPRequestHandler):
    def set_headers(self):
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')  # Allow requests from any origin
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')  # Allowed methods
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')  # Allowed headers

    def do_OPTIONS(self):
        self.send_response(200)
        self.set_headers()
        self.end_headers()

    def do_GET(self):
        # Parse the URL
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        if path == '/api/booktypes':
            # List book types
            self.send_response(200)
            self.set_headers()
            self.end_headers()
            self.wfile.write(json.dumps([bt.__dict__ for bt in list_book_types()]).encode('utf-8'))
        elif path.startswith('/api/booktype/'):
            # Get a specific book type by Id
            Id = int(path.split('/')[-1])
            book_type = get_book_type(Id)
            if book_type:
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(book_type.__dict__).encode('utf-8'))
            else:
                self.send_response(404)
                self.end_headers()
        elif path == '/api/books':
            # List books
            self.send_response(200)
            self.set_headers()
            self.end_headers()
            self.wfile.write(json.dumps([bt.__dict__ for bt in list_books()]).encode('utf-8'))
        elif path.startswith('/api/book/'):
            # Get a specific book by Id
            self.set_headers()
            self.end_headers()
            Id = int(path.split('/')[-1])
            book = get_book(Id)
            if book:
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(book.__dict__).encode('utf-8'))

        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        # Handle creation of a new book type
        if self.path == '/api/booktype':
            content_length = int(self.headers['Content-Length'])  # Get the size of data
            post_data = self.rfile.read(content_length)  # Read the data
            data = json.loads(post_data)  # Load the JSON data

            # Create new book type
            Id = data.get('Id')
            comment = data.get('comment')
            title = data.get('title')
            new_book_type = create_book_type(Id, comment, title)

            self.send_response(201)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(new_book_type.__dict__).encode('utf-8'))
        elif self.path == '/api/book':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)
            
            # Create new book
            Id = data.get('Id')
            title = data.get('title')
            author = data.get('author')
            book_type = data.get('book_type')
            new_book = create_book(Id, title, author, book_type)

            self.send_response(201)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(new_book.__dict__).encode('utf-8'))

    def do_PUT(self):
        # Handle update for a book type
        if self.path.startswith('/api/booktype/'):
            Id = int(self.path.split('/')[-1])
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)

            updated_book_type = update_book_type(Id, data.get('comment'), data.get('title'))
            if updated_book_type:
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(updated_book_type.__dict__).encode('utf-8'))
            else:
                self.send_response(404)
                self.end_headers()
        elif self.path.startswith('/api/book/'):
            Id = int(self.path.split('/')[-1])
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)

            updated_book = update_book(Id, data.get('title'), data.get('author'), data.get('book_type'))
            if updated_book:
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(updated_book.__dict__).encode('utf-8'))
            else:
                self.send_response(404)
                self.end_headers()

    def do_DELETE(self):
        # Handle deletion of a book type
        if self.path.startswith('/api/booktype/'):
            Id = int(self.path.split('/')[-1])
            delete_book_type(Id)
            self.send_response(204)  # No Content
            self.end_headers()
        elif self.path.startswith('/api/book/'):
            Id = int(self.path.split('/')[-1])
            delete_book(Id)
            self.send_response(204)
            self.end_headers()

# Run the server
if __name__ == '__main__':
    x=inital_books()
    v=inital_book_types()
    # lsit=list_books()
    # for i in lsit:
    #     print(i.__dict__)
    with socketserver.TCPServer(("", PORT), MyRequestHandler) as httpd:
         print(f"Serving on port {PORT}")
         httpd.serve_forever()
