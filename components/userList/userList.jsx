import React from "react";
import { Divider, List, ListItem, ListItemText } from "@material-ui/core";
import { Link } from "react-router-dom";
import "./userList.css";
import axios from 'axios';

class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: undefined
        };
    }

    componentDidMount() {
        this.fetchUsers();
    }

    fetchUsers() {
        axios.get("/user/list")
            .then(response => {
                this.setState({ users: response.data });
            })
            .catch(err => console.log(err.response));
    }

    componentDidUpdate(prevProps) {
        if (prevProps.view !== this.props.view) {
            this.props.changeView("Users List");
        }
    }

    render() {
        return this.state.users ? (
            <div>
                <List component="nav">
                    {this.state.users.map(user => (
                        <Link to={`/users/${user._id}`} key={user._id}>
                            <ListItem>
                                <ListItemText primary={`${user.first_name} ${user.last_name}`} />
                            </ListItem>
                            <Divider />
                        </Link>
                    ))}
                </List>
            </div>
        ) : (
            <div />
        );
    }
}

export default UserList;
