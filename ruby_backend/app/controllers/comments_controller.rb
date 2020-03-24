class CommentsController < ApplicationController

  def index
    comments = Comment.all
    render json: comments.to_json()
  end

  def create
    comment = Comment.new(comment_params)
    if comment.valid?
      comment.save
      redirect_to json: comment
    else
      render :new #... how do I go about this...
    end
  end

  def destroy
    comment = Comment.find(params[:id])
    comment.destroy
  end

  private
  def comment_params
    params.require(:comment).permit(:user_id, :drawing_id, :content)
  end
end
