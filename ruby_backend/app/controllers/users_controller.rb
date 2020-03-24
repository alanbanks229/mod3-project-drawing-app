class UsersController < ApplicationController

  def index
    users = User.all
    render json: users.to_json(
      :except => [:created_at, :updated_at],
      :include => 
      [
        {:drawings => {
          :except => [:updated_at]}},
        {:comments => {
          :except => [:updated_at]}}
      ]
    )

  end

  def show
    user = User.find_by
  end

  def create
    user = User.new(username: params[:username], password: params[:password])
    if user.valid?
      user.save
      session[:user_id] = user.id
      render json: user #sending this information to frontend
    else
      render json: {
        message: "Bad Input"
      }, status: 200
    end
    #end
  end

  def destroy
    user = User.find_by(id: params["id"])
    user.delete
  end



  private
  #for some reason ActionController::Parameters does not include 
   def user_params
    params.require(:user).permit(:username, :password)
   end
end
