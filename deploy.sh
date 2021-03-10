heroku create qonnectionz
heroku buildpacks:clear
# from tima anovsky, https://medium.com/@timanovsky/heroku-buildpack-to-support-deployment-from-subdirectory-e743c2c838dd
heroku buildpacks:set https://github.com/timanovsky/subdir-heroku-buildpack
heroku buildpacks:add heroku/python
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set PROJECT_PATH=back-end
git push heroku main