class DrawingsController < ApplicationController
  def index
    drawings = Drawing.all
    render json: drawings.to_json(:except => [:updated_at])
  end

  def create
  end

  def destroy
  end
end
