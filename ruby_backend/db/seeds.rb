# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

User.delete_all
Comment.delete_all
Drawing.delete_all

comments = [
    'This is beautiful, I wish I can draw like that',
    'This is mediocre... at best',
    'I\'m suprised that you were able to draw that with a touch pad.',
    'Someone definitely has a lot of time on their hands',
    'I can\'t believe it\'s not butter'
]

users_name = [
    'Andrew',
    'Austin',
    'Lily',
    'Rosie'
]

user_collection = []

alan = User.create(username: 'Alan', password: 'asdf')
alan_drawing = Drawing.create(user_id: alan.id, title: 'Majestic', description: "The Milky Way", image: "https://img.pngio.com/sanic-sticker-transparent-sanic-png-png-download-1024x1024-sanicpng-840_880.png", published: false)

users_name.each do |name|
    user_collection << User.create(username: name, password: 'asdf')
end

user_collection.each_with_index do |user, index|
    Comment.create(user_id: user.id, drawing_id: alan_drawing.id, content: comments[index])
end