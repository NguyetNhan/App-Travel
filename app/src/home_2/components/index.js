import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Image, Dimensions, FlatList, ToastAndroid, ScrollView, Modal, RefreshControl, PermissionsAndroid, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colorMain, urlServer, backgroundStatusBar } from '../../config';
import ItemAddress from './item_address';
import ItemList from './item_list';
import Geolocation from '@react-native-community/geolocation';
import { socket } from '../../socket';
import { AccountModel } from '../../models/account';

export default class Home extends Component {
        static navigationOptions = ({ navigation }) => {
                return {
                        tabBarLabel: 'Khám Phá',
                        tabBarIcon: ({ tintColor }) => (<Icon name='search' size={25} color={tintColor} />)
                }
        }

        constructor (props) {
                super(props);
                this.state = {
                        account: null,
                        listRestaurant: [],
                        listCoffee: [],
                        listRestaurantFollowLocation: [],
                        refreshing: false,
                        page: 1,
                        total_page: null,
                        isUpdateState: true,
                        typeRestaurant: null,
                        isLoadMore: true,
                        messages: '',
                        indexSliderImage: 0,
                        indexSliderImageRestaurant: 0,
                        indexSliderImageCoffee: 0,
                        indexSliderImageRestaurantFollowLocation: 0,
                        address: [
                                {
                                        name: 'Hồ Chí Minh',
                                        image: require('../../assets/images/image_hcm.jpg')
                                },
                                {
                                        name: 'Hà Nội',
                                        image: require('../../assets/images/image_hanoi.jpg')
                                },
                                {
                                        name: 'Đà Nẵng',
                                        image: require('../../assets/images/image_danang.jpg')
                                }
                        ],
                }
                socket.connect();
                //    this.fetchInfoAccountFromLocal();
                this._onClickItemFlatList = this._onClickItemFlatList.bind(this);
                this._onClickModalRestaurant = this._onClickModalRestaurant.bind(this);
                this._onClickModalCoffee = this._onClickModalCoffee.bind(this);
                this._onClickModalBar = this._onClickModalBar.bind(this);
        }

        async fetchInfoAccountFromLocal () {
                const result = await AccountModel.FetchInfoAccountFromDatabaseLocal();
                if (result.error) {
                        Alert.alert(
                                'Thông Báo Lỗi',
                                'Bạn chưa đăng nhập !',
                                [
                                        { text: 'OK' },
                                ],
                                { cancelable: false },
                        );
                        this.props.navigation.navigate('Auth');
                } else {
                        this.setState({
                                account: result.data
                        });
                        try {
                                const granted = await PermissionsAndroid.request(
                                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                                );
                                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                                        Geolocation.getCurrentPosition((position) => {
                                                const position1 = {
                                                        latitude: position.coords.latitude,
                                                        longitude: position.coords.longitude,
                                                }
                                                socket.emit('infoAccount', { idAccount: result.data.id, location: position1 })
                                                //   this.props.onFetchNearbyLocationRestaurant(position1);
                                        }, (error) => {
                                                console.log('error: ', error);
                                        }, {
                                                enableHighAccuracy: true,
                                                timeout: 20000,
                                                maximumAge: 1000
                                        })
                                } else {
                                        alert('Chức năng này không được bạn cho phép sử dụng !');
                                }
                        } catch (err) {
                                console.warn(err);
                        }
                }

        }

        async  requestLocationPermission () {
                try {
                        const granted = await PermissionsAndroid.request(
                                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                        );
                        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                                Geolocation.getCurrentPosition((position) => {
                                        const position1 = {
                                                latitude: position.coords.latitude,
                                                longitude: position.coords.longitude,
                                        }
                                        socket.emit('infoAccount', position1)
                                        //   this.props.onFetchNearbyLocationRestaurant(position1);
                                }, (error) => {
                                        console.log('error: ', error);
                                }, {
                                        enableHighAccuracy: true,
                                        timeout: 20000,
                                        maximumAge: 1000
                                })
                        } else {
                                alert('Chức năng này không được bạn cho phép sử dụng !');
                        }
                } catch (err) {
                        console.warn(err);
                }
        }

        /*   componentDidMount () {
                  //    this.fetchInfoAccountFromLocal();
                  this.props.onFetchListRestaurant({
                          type: 'restaurant',
                          page: 1
                  });
                  this.props.onFetchListCoffee({
                          type: 'coffee',
                          page: 1
                  });
          } */

        static getDerivedStateFromProps (nextProps, prevState) {
                if (nextProps.listRestaurantFollowLocation !== prevState.listRestaurantFollowLocation && nextProps.listRestaurantFollowLocation !== undefined) {
                        if (prevState.isUpdateState) {
                                const array = (prevState.listRestaurantFollowLocation).concat(nextProps.listRestaurantFollowLocation);
                                prevState.listRestaurantFollowLocation = array;
                        } else {
                                prevState.isUpdateState = true;
                                prevState.isLoadMore = true;
                        }
                }
                if (nextProps.listRestaurant !== prevState.listRestaurant && nextProps.listRestaurant !== undefined) {
                        if (prevState.isUpdateState) {
                                const array = (prevState.listRestaurant).concat(nextProps.listRestaurant);
                                prevState.listRestaurant = array;
                        } else {
                                prevState.isUpdateState = true;
                                prevState.isLoadMore = true;
                        }
                }
                if (nextProps.listCoffee !== prevState.listCoffee && nextProps.listCoffee !== undefined) {
                        if (prevState.isUpdateState) {
                                const array = (prevState.listCoffee).concat(nextProps.listCoffee);
                                prevState.listCoffee = array;
                        } else {
                                prevState.isUpdateState = true;
                                prevState.isLoadMore = true;
                        }
                }
                if (nextProps.listBar !== prevState.listBar && nextProps.listBar !== undefined) {
                        if (prevState.isUpdateState) {
                                const array = (prevState.listBar).concat(nextProps.listBar);
                                prevState.listBar = array;
                        } else {
                                prevState.isUpdateState = true;
                                prevState.isLoadMore = true;
                        }
                }
                if (nextProps.messages !== prevState.messages && nextProps.messages !== undefined) {
                        console.log('fetchListRestaurantFailed.messages: ', fetchListRestaurantFailed.messages);
                }
                if (nextProps.isLoading !== prevState.refreshing && nextProps.isLoading !== undefined) {
                        prevState.refreshing = nextProps.isLoading
                }
                return null;
        }

        _onLoadMoreRestaurant () {
                const isLoadMore = this.state.isLoadMore;
                if (isLoadMore) {
                        var page = this.state.page;
                        const total_page = this.state.total_page;
                        const pageNew = page + 1;
                        if (pageNew > total_page) {
                                //  ToastAndroid.show('Không còn dữ liệu !', ToastAndroid.SHORT);
                        } else {
                                const data = {
                                        type: this.state.typeRestaurant,
                                        page: pageNew
                                };
                                this.props.onFetchListRestaurant(data);
                        }
                }
        }

        _onClickButtonIconTypeRestaurant (type) {
                this.setState({
                        typeRestaurant: type,
                        listRestaurant: [],
                        isUpdateState: false,
                        page: 1,
                        isLoadMore: false
                });
                const data = {
                        type: type,
                        page: 1
                }
                this.props.onFetchListRestaurant(data);
        }

        _onClickItemFlatList (idRestaurant, idAdmin) {
                var data = {
                        idRestaurant: idRestaurant,
                        idAdmin: idAdmin
                }
                this.props.navigation.navigate('DetailRestaurant', {
                        IdConfigDetailRestaurant: data,
                        GoBack: 'Home'
                });
        }

        _onRefresh = () => {
                this.setState({
                        listRestaurant: [],
                        listCoffee: [],
                        listBar: [],
                        listRestaurantFollowLocation: [],
                        refreshing: true
                });
                this.props.onFetchListRestaurant({
                        type: 'restaurant',
                        page: 1
                });
                this.props.onFetchListBar({
                        type: 'bar',
                        page: 1
                });
                this.props.onFetchListCoffee({
                        type: 'coffee',
                        page: 1
                });
                this.requestLocationPermission();
        }

        _onClickModalRestaurant () {
                this.setState({
                        visibleModalRestaurant: !this.state.visibleModalRestaurant
                })
        }
        _onClickModalBar () {
                this.setState({
                        visibleModalBar: !this.state.visibleModalBar
                })
        }
        _onClickModalCoffee () {
                this.setState({
                        visibleModalCoffee: !this.state.visibleModalCoffee
                })
        }
        _onClickButtonSearch (type, address) {
                this.props.navigation.navigate('Search', {
                        Condition: {
                                type: type,
                                address: address
                        }
                });
        }
        render () {
                const screenWidth = Dimensions.get('window').width;
                return (
                        <View style={styles.container}>
                                <StatusBar
                                        backgroundColor={backgroundStatusBar}
                                        barStyle='light-content'
                                />
                                {/* <View style={styles.containerHeader}>
                                        <TouchableOpacity onPress={this.props.navigation.openDrawer}>
                                                <Icon name='menu' size={25} color='black' />
                                        </TouchableOpacity>
                                        <Text style={styles.textHeader}>Khám Phá</Text>
                                        <TouchableOpacity onPress={() => {
                                                this.props.navigation.navigate('Search');
                                        }}>
                                                <Icon name='search' size={25} color='black' />
                                        </TouchableOpacity>
                                </View> */}
                                <View
                                        onTouchStart={() => this.props.navigation.navigate('Search')}
                                        style={styles.containerSearch}>
                                        <Icon name='search' size={25} color='white' />
                                        <Text style={styles.textTitleSearch}>tìm kiếm nhà hàng, bạn bè...</Text>
                                </View>
                                <ScrollView
                                        refreshControl={
                                                <RefreshControl
                                                        refreshing={this.state.refreshing}
                                                        onRefresh={this._onRefresh}
                                                />
                                        }
                                >
                                        <View style={styles.selectIconType}>
                                                <TouchableOpacity style={{
                                                        backgroundColor: 'white',
                                                        width: (screenWidth - 60) / 3,
                                                        height: (screenWidth - 60) / 3,
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                }}
                                                        onPress={() => {
                                                                this._onClickButtonSearch('restaurant', 'Hồ Chí Minh')
                                                        }}
                                                >
                                                        <Image
                                                                source={require('../../assets/images/icon_restaurant.png')}
                                                                style={styles.imageIconSelectType}
                                                        />
                                                        <Text style={styles.textTitleType}>Nhà hàng</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{
                                                        backgroundColor: 'white',
                                                        width: (screenWidth - 60) / 3,
                                                        height: (screenWidth - 60) / 3,
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        marginHorizontal: 10
                                                }}
                                                        onPress={() => {
                                                                this._onClickButtonSearch('coffee', 'Hồ Chí Minh')
                                                        }}
                                                >
                                                        <Image
                                                                source={require('../../assets/images/icon_coffee.png')}
                                                                style={styles.imageIconSelectType}
                                                        />
                                                        <Text style={styles.textTitleType}>Coffee & Trà</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{
                                                        backgroundColor: 'white',
                                                        width: (screenWidth - 60) / 3,
                                                        height: (screenWidth - 60) / 3,
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                }}
                                                        onPress={() => {
                                                                this._onClickButtonSearch('bar', 'Hồ Chí Minh')
                                                        }}
                                                >
                                                        <Image
                                                                source={require('../../assets/images/icon_bar.png')}
                                                                style={styles.imageIconSelectType}
                                                        />
                                                        <Text style={styles.textTitleType}>Bar</Text>
                                                </TouchableOpacity>
                                        </View>
                                        {/* <Text style={{
                                                margin: 20,
                                                fontFamily: 'UVN-Baisau-Bold',
                                                fontSize: 20,
                                                textTransform: 'capitalize'
                                        }}>địa điểm phổ biến</Text>
                                        <Carousel
                                                data={this.state.address}
                                                layout={'default'}
                                                sliderWidth={screenWidth}
                                                sliderHeight={300}
                                                firstItem={0}
                                                itemWidth={250}
                                                onSnapToItem={(index) => this.setState({ indexSliderImage: index })}
                                                inactiveSlideScale={0.94}
                                                inactiveSlideOpacity={0.5}
                                                renderItem={(item) => {
                                                        return (
                                                                <ItemAddress
                                                                        address={item.item}
                                                                />
                                                        );
                                                }}
                                        /> */}
                                        <View style={styles.containerTitle}>
                                                <Text style={styles.textTitle}>top ăn uống</Text>
                                                <Text style={styles.textXemThem}>xem thêm</Text>
                                        </View>
                                        <Carousel
                                                data={this.state.address}
                                                layout={'default'}
                                                sliderWidth={screenWidth}
                                                sliderHeight={300}
                                                firstItem={0}
                                                itemWidth={250}
                                                onSnapToItem={(index) => this.setState({ indexSliderImage: index })}
                                                inactiveSlideScale={0.94}
                                                inactiveSlideOpacity={0.5}
                                                renderItem={(item) => {
                                                        return (
                                                                <ItemAddress
                                                                        address={item.item}
                                                                />
                                                        );
                                                }}
                                        />
                                        <View style={styles.containerTitle}>
                                                <Text style={styles.textTitle}>các địa điểm gần bạn nhất</Text>
                                                <Text style={styles.textXemThem}>xem thêm</Text>
                                        </View>
                                        <Carousel
                                                data={this.state.listRestaurantFollowLocation}
                                                layout={'default'}
                                                sliderWidth={screenWidth}
                                                sliderHeight={300}
                                                firstItem={0}
                                                itemWidth={250}
                                                onSnapToItem={(index) => this.setState({ indexSliderImageRestaurantFollowLocation: index })}
                                                inactiveSlideScale={0.94}
                                                inactiveSlideOpacity={0.5}
                                                renderItem={(item) => {
                                                        return (
                                                                <ItemList
                                                                        _onClickItemFlatList={this._onClickItemFlatList}
                                                                        itemList={item.item}
                                                                />
                                                        );
                                                }}
                                        />
                                        <View style={styles.containerTitle}>
                                                <Text style={styles.textTitle}>nhà hàng không gian đẹp</Text>
                                                <Text style={styles.textXemThem}>xem thêm</Text>
                                        </View>
                                        <Carousel
                                                data={this.state.listRestaurant}
                                                layout={'default'}
                                                sliderWidth={screenWidth}
                                                sliderHeight={300}
                                                firstItem={0}
                                                itemWidth={250}
                                                onSnapToItem={(index) => this.setState({ indexSliderImageRestaurant: index })}
                                                inactiveSlideScale={0.94}
                                                inactiveSlideOpacity={0.5}
                                                renderItem={(item) => {
                                                        return (
                                                                <ItemList
                                                                        _onClickItemFlatList={this._onClickItemFlatList}
                                                                        itemList={item.item}
                                                                />
                                                        );
                                                }}
                                        />
                                        <View style={styles.containerTitle}>
                                                <Text style={styles.textTitle}>quán cà phê độc đáo</Text>
                                                <Text style={styles.textXemThem}>xem thêm</Text>
                                        </View>
                                        <Carousel
                                                data={this.state.listCoffee}
                                                layout={'default'}
                                                sliderWidth={screenWidth}
                                                sliderHeight={300}
                                                firstItem={0}
                                                itemWidth={250}
                                                onSnapToItem={(index) => this.setState({ indexSliderImageCoffee: index })}
                                                inactiveSlideScale={0.94}
                                                inactiveSlideOpacity={0.5}
                                                renderItem={(item) => {
                                                        return (
                                                                <ItemList
                                                                        _onClickItemFlatList={this._onClickItemFlatList}
                                                                        itemList={item.item}
                                                                />
                                                        );
                                                }}
                                        />

                                </ScrollView>
                        </View>
                );
        }
}

const styles = StyleSheet.create({
        container: {
                flex: 1,
                alignItems: 'center',
        },
        containerSearch: {
                flexDirection: 'row',
                height: 55,
                backgroundColor: colorMain,
                paddingHorizontal: 20,
                alignItems: 'center',
                justifyContent: 'center'
        },
        textTitleSearch: {
                fontFamily: 'UVN-Baisau-Regular',
                textTransform: 'capitalize',
                color: 'white',
                flex: 1,
                marginLeft: 10,
                fontSize: 16
        },
        containerHeader: {
                width: '100%',
                height: 50,
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: 'white',
                alignItems: 'center',
                paddingHorizontal: 20
        },
        textHeader: {
                fontFamily: 'UVN-Baisau-Bold',
                fontSize: 18
        },
        selectIconType: {
                flexDirection: 'row',
                margin: 20,
                alignItems: 'center',
                justifyContent: 'space-between',
        },
        imageIconSelectType: {
                width: 50,
                height: 50,
                marginBottom: 5
        },
        textTitleType: {
                fontFamily: 'UVN-Baisau-Regular',
                textTransform: 'capitalize'
        },
        textTitle: {
                fontFamily: 'UVN-Baisau-Bold',
                fontSize: 20,
                textTransform: "capitalize"
        },
        containerTitle: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: 20
        },
        textXemThem: {
                fontFamily: 'UVN-Baisau-Regular',
                fontSize: 12,
                color: colorMain,
                textTransform: 'capitalize'
        }
})