from datetime import datetime
import book_type
books = []
class BookDTO:
    def __init__(self, Id, comment, title, Writer_Email, Book_Type, createdate=None):
        self.Id = Id
        self.comment = comment
        self.title = title
        self.Writer_Email = Writer_Email
        self.Book_Type = Book_Type
        self.createdate = str(createdate)  or str(datetime.date.today())
def find_book(Id):
    return next((bk for bk in books if bk.Id == Id), None)
# CRUD for Book
def create_book(Id, comment, title, Writer_Email, Book_Type,createdate=None):
    # print("Book Type found{0}",Book_Type)
    if not book_type.find_book_type(Book_Type):
        print("Book Type not found")
    else:  
    #  print("Book Type found{0}",Book_Type)
     book = BookDTO(Id, comment, title, Writer_Email, Book_Type,createdate)
   
     books.append(book)
     return book

def inital_books():
     create_book(1, "Great book1", "The Great Adventure", "author1@example.com", 1,datetime.now())
     create_book(2, "Great book2", "The Great Adventure", "author@example.com", 1,datetime.now())
     create_book(3, "Great book3", "The Great Adventure", "author1@example.com", 3,datetime.now())
     create_book(4, "Great book4", "The Great Adventure", "author@example.com", 3,datetime.now())
     create_book(5, "Great book5", "The Great Adventure", "author3@example.com", 3,datetime.now())
     create_book(6, "Great book6", "The Great Adventure", "author3@example.com", 2,datetime.now())
     return books
def list_books():
    return books
    # Id=0,comment=None,title=None,Writer_Email=None,Book_Type=0,createdate=None,startDate=None, endDate=None
    #if startDate and endDate:
    #     return [bk for bk in books if startDate <= bk.createdate <= endDate]
    # if startDate:
    #     return [bk for bk in books if bk.createdate >= startDate]
    # if endDate:
    #     return [bk for bk in books if bk.createdate <= endDate]
    # if Id:
    #     return [bk for bk in books if bk.Id == Id]
    # if comment:
    #     return [bk for bk in books if bk.comment == comment]
    # if title:
    #     return [bk for bk in books if bk.title == title]
    # if Writer_Email:
    #     return [bk for bk in books if bk.Writer_Email == Writer_Email]
    # if Book_Type:
    #     return [bk for bk in books if bk.Book_Type == Book_Type]
    # if createdate:
    #     return [bk for bk in books if bk.createdate == createdate]
    # else:
       
   

def get_book(Id):
    return find_book(Id)

def update_book(Id, comment, title, Writer_Email, Book_Type):
    book = find_book(Id)
    if book:
        book.comment = comment
        book.title = title
        book.Writer_Email = Writer_Email
        book.Book_Type = Book_Type
        return book
    return None

def delete_book(Id):
    global books
    books = [bk for bk in books if bk.Id != Id]
    return books