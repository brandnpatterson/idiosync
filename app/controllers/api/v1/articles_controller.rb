class Api::V1::ArticlesController < ApplicationController

  def create
    @article = Article.new(article_params)
    @article.save
    render json: @article, status: :created
  end

  def index
    @articles = Article.except('order').order("id ASC")
    render json: @articles, status: :ok
  end

  def update
    @article = Article.where(id: params[:id]).first
    if @article.update_attributes(article_params)
      render json: @article, status: :ok
    else
      head(:unprocessable_entity)
    end
  end

  def destroy
    @article = Article.where(id: params[:id]).first
    if @article.destroy
      head(:ok)
    else
      head(:unprocessable_entity)
    end
  end

  private

  def article_params
    params.permit(:title, :author_id, :content, :tag_list)
  end
end
