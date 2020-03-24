class SessionsController < ApplicationController

    def new
    end
  
    def create
      user = User.find_by(username: params[:username])
      if (user && user.authenticate(params[:password]))
        puts "IT worked!!!!"
        session[:user_id] = user.id
        session[:username] = user.username
        render :json => session
      else 
        puts "NO BUENOOOOOOOO"
        render json: {
          message: "Bad Request"
          }, status: 404
      end

      #byebug
    end
      
    def destroy
      session.clear
    end
  end