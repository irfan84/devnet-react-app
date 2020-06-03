const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
const request = require('request');
const axios = require('axios');
const { check, validationResult } = require('express-validator');

// @desc    Get current users profile
// @route   GET api/profile/me
// @access  Private

router.get('/me', auth, async (req, res) => {
    try {
        profile = await Profile.findOne({ user: req.user.id }).populate({
            path: 'user',
            select: 'name avatar'
        });
        if(!profile){
            res.status(400).json({msg: 'There is no profile for this user'});
        }
        res.status(200).json(profile);
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send('Server error')
    }
});

// @desc    create or update user profile
// @route   POST api/profile
// @access  private

router.post('/', [auth, check('status', 'Status field is required').not().isEmpty(),
            check('skills', 'Skills field is required').not().isEmpty()],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        };
        const { company, website, location, bio, status,
                githubusername, skills, youtube, facebook, twitter,
                instagram, linkedin } = req.body;

        // Build profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if(company) profileFields.company = company;
        if(website) profileFields.website = website;
        if(location) profileFields.location = location;
        if(bio) profileFields.bio = bio;
        if(status) profileFields.status = status;
        if(githubusername) profileFields.githubusername = githubusername;
        if(skills) profileFields.skills = skills.split(',').map(skill => skill.trim());

        // Build social object
        profileFields.social = {};
        if(youtube) profileFields.social.youtube = youtube;
        if(facebook) profileFields.social.facebook = facebook;
        if(twitter) profileFields.social.twitter = twitter;
        if(instagram) profileFields.social.instagram = instagram;
        if(linkedin) profileFields.social.linkedin = linkedin;

        try {
            profile = await Profile.findOne({ user: req.user.id });
            if(profile) {
                // Update
                profile = await Profile.findOneAndUpdate(
                    {user: req.user.id},
                    {$set: profileFields},
                    {new: true });
                return res.status(201).json(profile);
            }

            // Create
            profile = new Profile(profileFields);
            await profile.save();
            return res.status(201).json(profile);
        }
        catch (err) {
            console.log(err.message);
            return res.status(500).send('Server error');

        }
});

// @desc    Get all profiles
// @route   GET api/profile
// @access  Public

router.get('/', async (req, res) => {
    try {
        profiles = await Profile.find().populate({
            path: 'user',
            select: 'name avatar'
        });
        return res.status(200).json(profiles);
    } catch (err) {
    console.log(err.message);
    return res.status(500).send('Server error');
    }
});

// @desc    Get users profile by user ID
// @route   GET api/profile/:user_id
// @access  Public

router.get('/:user_id', async (req, res) => {
    try {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate({
        path: 'user',
        select: 'name avatar'
    });
    if(!profile){
        res.status(400).json({msg: 'Profile not found'});
    }
    res.status(200).json(profile);
        }

    catch (err) {
        console.log(err.message);
        if(err.name === 'CastError'){
            res.status(400).json('Profile not found');
        }
        res.status(500).send('Server Error');
    }
});

// @desc    Delete profile, user & post
// @route   DELETE api/profile
// @access  Private

router.delete('/', auth, async (req, res) => {
    try {
        // Remove users post
        await Post.deleteMany({ user: req.user.id })
        // Remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        // Remove user
        await User.findOneAndRemove({ _id: req.user.id });
        res.status(200).json({msg: 'User deleted'});
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

// @desc    Add profile experience
// @route   PUT api/profile/experience
// @access  Private

router.put('/experience', [ auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
    ]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    const { title, company, from, to, current, description } = req.body;
    const newExp = { title, company, from, to, current, description };
    try {
    const profile = await Profile.findOne({ user: req.user.id });
    profile.experience.unshift(newExp);
    await profile.save();
    res.status(200).json(profile);
    }
    catch (err){
        console.log(err.message);
        res.status(500).json('Server error')
    }
});

// @desc    Delete profile experience
// @route   DELETE api/profile/experience/:exp_id
// @access  Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        profile = await Profile.findOne({ user: req.user.id });

        // Get remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1);
        await profile.save();
        res.status(200).json(profile);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

// @desc    Add profile education
// @route   PUT api/profile/education
// @access  Private

router.put('/education', [ auth, [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    const { school, degree, fieldofstudy, from, to, current, description } = req.body;
    const newEdu = { school, degree, fieldofstudy, from, to, current, description };
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.education.unshift(newEdu);
        await profile.save();
        res.status(200).json(profile);
    }
    catch (err){
        console.log(err.message);
        res.status(500).json('Server error')
    }
});

// @desc    Delete profile education
// @route   DELETE api/profile/education/:edu_id
// @access  Private

router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        profile = await Profile.findOne({ user: req.user.id });

        // Get remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
        profile.education.splice(removeIndex, 1);
        await profile.save();
        res.status(200).json(profile);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public
router.get('/github/:username', async (req, res) => {
    try {
        const uri = encodeURI(
            `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
        );
        console.log(uri);
        const headers = {
            'user-agent': 'node.js',
            'Authorization': `token ${process.env.GITHUB_TOKEN}`
        };

        const gitHubResponse = await axios.get(uri, { headers });
        return res.json(gitHubResponse.data);
    } catch (err) {
        console.error(err.message);
        return res.status(404).json({ msg: 'No Github profile found' });
    }
});

module.exports = router;