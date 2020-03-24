class ApplicationController < ActionController::API

  #I can't believe I needed the below, so freaking stupid  
  include ActionController::Helpers
 # This ^^^^^^

    helper_method :current_user

      def current_user
        if session[:user_id]
          current_user ||= User.find(session[:user_id])
        else
          current_user = nil
        end
      end

end
