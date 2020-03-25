class DrawingsController < ApplicationController
  def index
    drawings = Drawing.all
    render json: drawings.to_json(:except => [:updated_at],
      :include => 
      [
        {:comments => {
          :except => [:updated_at],
          :include =>
          [
            {:user => {
              :only => [:username]
            }}
          ]
          }
        },
        {:user => {
          :except => [:updated_at]}}
      ]
    ) 
  end

  def create
    drawing = Drawing.new(draw_params)
    #byebug
    if drawing.valid?
      drawing.save
      render json: drawing #sending this information to frontend
    else
      render json: {
        message: "Please Input a Title for your drawing", status: 220}
    end

  end

  def destroy
  end

  private
   def draw_params
    params.require(:drawing).permit(:user_id, :title, :description, :image, :published)
   end
end
