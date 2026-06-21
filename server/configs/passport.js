import dotenv from 'dotenv'
dotenv.config() // load env vars here directly — don't rely on index.js's dotenv.config() running first, since imports resolve before that line executes

import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '../models/user.js'

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id })

    if (!user) {
      user = await User.findOne({ email: profile.emails[0].value })

      if (user) {
        // existing email/password account — link Google to it
        user.googleId = profile.id
        if (!user.avatar) user.avatar = profile.photos?.[0]?.value
        await user.save()
      } else {
        // brand new user — generate a unique username from their email
        let baseUsername = profile.emails[0].value.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
        let username = baseUsername
        let count = 1
        while (await User.findOne({ username })) {
          username = `${baseUsername}${count}`
          count++
        }

        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          username,
          avatar: profile.photos?.[0]?.value
        })
      }
    }

    done(null, user)
  } catch (err) {
    done(err, null)
  }
}))

export default passport