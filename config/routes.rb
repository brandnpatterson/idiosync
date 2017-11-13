Rails.application.routes.draw do
  devise_for :users
  namespace :api do
    namespace :v1 do
      resources :articles
      resources :authors
      resources :sessions, only: [:create, :destroy]
    end
  end
  root to: "home#index"
  get '*path', to: 'home#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
