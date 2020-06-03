import React from 'react';
import { Route, Switch } from 'react-router-dom';
import '../../App.css';
import Login from "../auth/Login";
import Register from "../auth/Register";
import Dashboard from "../dashboard/Dashboard";
import Profile from "../profile/Profile";
import Profiles from "../profiles/Profiles";
import Posts from "../posts/Posts";
import Post from "../post/Post";
import CreateProfile from "../profile-forms/CreateProfile";
import EditProfile from "../profile-forms/EditProfile";
import AddExperience from "../profile-forms/AddExperience";
import AddEducation from "../profile-forms/AddEducation";
import Alert from "../layout/Alert";
import PrivateRoute from "./PrivateRoute";

const Routes = props => {
    return (
        <section className="container">
            <Alert />
            <Switch>
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/profiles" component={Profiles} />
                <Route exact path="/profile/:id" component={Profile} />
                <PrivateRoute exact path="/posts" component={Posts} />
                <PrivateRoute exact path="/post/:id" component={Post} />
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <PrivateRoute exact path="/create-profile" component={CreateProfile} />
                <PrivateRoute exact path="/edit-profile" component={EditProfile} />
                <AddExperience exact path="/add-experience" component={AddExperience} />
                <AddEducation exact path="/add-education" component={AddEducation} />
            </Switch>
        </section>
    )
};

export default Routes;
