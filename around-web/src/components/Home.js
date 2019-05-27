import React from 'react';
import { Tabs, Button, Spin } from 'antd';
import { GEO_OPTIONS, POS_KEY, API_ROOT, AUTH_HEADER, TOKEN_KEY } from '../constants';
import { Gallery } from './Gallery';
import { CreatePostButton } from './CreatePostButton';
import { AroundMap } from './AroundMap';

const TabPane = Tabs.TabPane;

export class Home extends React.Component {
    state = {
        isLoadingPosts: false,
        isLoadingGeolocation: false,
        error: '',
        posts: []
    }

    componentDidMount() {
        if ('geolocation' in navigator) {
            this.setState({
                isLoadingGeolocation: true
            });
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeolocation,
                this.onFailedLoadGeolocation,
                GEO_OPTIONS
            );
        } else {
            this.setState({
                error: 'Geolocation is not supported.'
            });
        }
    }

    onSuccessLoadGeolocation = (position) => {
        const { latitude, longitude } = position.coords;

        localStorage.setItem(POS_KEY, JSON.stringify({
            lat: latitude,
            lon: longitude
        }));

        this.setState({
            isLoadingGeolocation: false
        });
        this.loadNearbyPosts();
    }

    onFailedLoadGeolocation = (error) => {
        console.log(error);
        this.setState({
            isLoadingGeolocation: false,
            error: error.message
        });
    }

    loadNearbyPosts = (center, radius) => {
        const { lat, lon } = center ? center: JSON.parse(localStorage.getItem(POS_KEY));
        const range = radius ? radius: 20;
        const token = localStorage.getItem(TOKEN_KEY);

        this.setState({
            isLoadingPosts: true,
            error: ''
        });
        fetch(`${API_ROOT}/search?lat=${lat}&lon=${lon}&range=${range}`, {
            method: 'GET',
            headers: {
                Authorization: `${AUTH_HEADER} ${token}`
            }
        })
            .then(
                (response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error("Failed to load posts");
                }
            )
            .then(
                (data) => {
                    this.setState({
                        isLoadingPosts: false,
                        posts: data ? data : []
                    });
                }
            )
            .catch(
                () => {
                    this.setState({
                        isLoadingPosts: false,
                        error: 'Failed to load posts'
                    });
                }
            );
    }

    getImagePosts = () => {
        const { error, isLoadingGeolocation, isLoadingPosts, posts } = this.state;

        if (error) {
            return <div>{error}</div>;
        } else if (isLoadingGeolocation) {
            return <Spin tip="Loading geolocation..." />;
        } else if (isLoadingPosts) {
            return <Spin tip="Loading posts..." />;
        } else if (posts && posts.length > 0) {
            const images = posts.map(({ user, url, message }) => {
                return {
                    user,
                    src: url,
                    thumbnail: url,
                    caption: message,
                    thumbnailWidth: 400,
                    thumbnailHeight: 300
                }
            });
            return <Gallery images={images} />
        } else {
            return <div>No nearby posts.</div>;
        }
    }

    render() {
        const operations = <CreatePostButton loadNearbyPosts={this.loadNearbyPosts} />;

        return (
            <div className="home">
                <Tabs tabBarExtraContent={operations}>
                    <TabPane tab="Image Posts" key="1">
                        {this.getImagePosts()}
                    </TabPane>
                    <TabPane tab="Video Posts" key="2">
                        Content of tab 2
                    </TabPane>
                    <TabPane tab="Map" key="3">
                        <AroundMap
                            googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyD3CEh9DXuyjozqptVB5LA-dN7MxWWkr9s"
                            loadingElement={<div style={{ height: `100%` }} />}
                            containerElement={<div style={{ height: `600px` }} />}
                            mapElement={<div style={{ height: `100%` }} />}
                            posts={this.state.posts}
                            loadNearbyPosts={this.loadNearbyPosts}
                        />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
