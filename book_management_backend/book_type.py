import datetime

# Mock database tables
book_types = []


# Data Transfer Objects (DTO)
class BookTypeDTO:
    def __init__(self, Id, comment, title, createdate=None):
        self.Id = Id
        self.comment = comment
        self.title = title
        self.createdate = str(createdate) or datetime.date.today()



# Helper Functions
def find_book_type(Id):
    x=(bt for bt in book_types if bt.Id == Id)
    return x
    # return next((bt for bt in book_types if bt.Id == Id), None)


# CRUD for BookType
def create_book_type(Id, comment, title):
    book_type = BookTypeDTO(Id, comment, title)
    book_types.append(book_type)
    return book_type

def inital_book_types():
    
    create_book_type(1, "Fiction", "Fictional books")
    create_book_type(2, "Cultural", "Cultural books")
    create_book_type(3, "Science", "Science books")
    return book_types
def list_book_types():
    return book_types

def get_book_type(Id):
    return find_book_type(Id)

def update_book_type(Id, comment, title):
    book_type = find_book_type(Id)
    if book_type:
        book_type.comment = comment
        book_type.title = title
        return book_type
    return None

def delete_book_type(Id):
    global book_types
    book_types = [bt for bt in book_types if bt.Id != Id]
    return book_types
