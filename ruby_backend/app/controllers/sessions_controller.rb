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
          message: "Invalid username and/or password", status: 220}
      end

    end
      
    def destroy
      session.clear
    end
  end