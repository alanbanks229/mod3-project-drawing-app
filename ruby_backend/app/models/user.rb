class User < ApplicationRecord
    #When you delete a drawing... it will delete all comments associated with it... i think
    has_many :drawings, dependent: :destroy
    
    has_many :comments

    validates :username, presence: true, uniqueness: true

    #We can use this because we uncommented ruby gem 'bcrypt'
    has_secure_password
    
end
