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
    'Rosie'
]

user_collection = []

alan = User.create(username: 'Alan', password: 'asdf')
alan_drawing = Drawing.create(user_id: alan.id, title: 'Majestic', description: "The Milky Way", image: "https://img.pngio.com/sanic-sticker-transparent-sanic-png-png-download-1024x1024-sanicpng-840_880.png", published: true)
alan_drawing2 = Drawing.create(user_id: alan.id, title: 'Issa Me Mario', description: "Hops for days", image: "https://pngimg.com/uploads/mario/mario_PNG64.png", published: true)

lily = User.create(username: 'Lily', password: 'asdf')
lily_drawing = Drawing.create(user_id: lily.id, title: 'Tulip Pixel Art', description: "I only used 6 different colored pixels :)", image: "https://cdn.shopify.com/s/files/1/0822/1983/articles/tulip-2-pixel-art-pixel-art-tulip-flower-plant-pink-lily-pixel-8bit.png?v=1501253296", published: true)

users_name.each do |name|
    user_collection << User.create(username: name, password: 'asdf')
end

user_collection.each_with_index do |user, index|
    Comment.create(user_id: user.id, drawing_id: alan_drawing.id, content: comments[index])
end

Comment.create(user_id: alan.id, drawing_id: lily_drawing.id, content: "Dang that's actually astounding... 10/10")

