Rails.application.routes.draw do

  resources :users
  resources :drawings
  resources :comments
  resources :sessions #, only: [:new, :create, :destroy]

  #get 'login', to: 'sessions#new', as: 'login'
  #get 'logout', to: 'sessions#destroy', as: 'logout'

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
