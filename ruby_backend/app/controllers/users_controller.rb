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
    #debugger
    user = User.find(params[:id])
    render json: user.to_json(
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

  def create
    input_length = params[:username].length
    user_exists = User.find_by(username: params[:username])
    user = User.new(username: params[:username], password: params[:password])

    if user.valid?
      user.save
      session[:user_id] = user.id
      render json: user #sending this information to frontend
    else
        if (user_exists)
          render json: {
            message: "This username is already Taken", status: 220}
        elsif (input_length == 0)
          render json: {
            message: "please input atleast 1 character in username textfield", status: 220
          }
        else
          render json: {
            message: "something is wrong with your input try again", status: 220
          }
        end
    end
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
