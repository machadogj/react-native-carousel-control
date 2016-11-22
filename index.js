"use strict";

import React, { Component, PropTypes } from "react";
import {
    Dimensions,
    StyleSheet,
    View,
    ScrollView,
    Text,
    TouchableWithoutFeedback
} from "react-native";

import styles from "./styles";

let { width } = Dimensions.get("window");

export default class Carousel extends Component {

    displayName = "Carousel";

    static propTypes = {
        pageStyle: PropTypes.object,
        pageWidth: PropTypes.number,
        children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ]).isRequired,
        initialPage: PropTypes.number,
        noItemsText: PropTypes.string,
        onPageChange: PropTypes.func,
        sneak: PropTypes.number,
        transitionDelay: PropTypes.number,
        currentPage: PropTypes.number
    };

    static defaultProps = {
        initialPage: 0,
        pageStyle: null,
        pageWidth: width - 80,
        sneak: 20,
        noItemsText: "Sorry, there are currently \n no items available",
        transitionDelay: 0
    };

    componentWillMount() {
        this.calculateGap(this.props);
    }

    componentDidMount() {
        if (this.props.children && this.props.initialPage > 0 && this.props.initialPage < this.props.children.length) {
            this.goToPage(this.props.initialPage);
        }
    }

    componentWillReceiveProps(props) {
        let { pageWidth } = this.props;
        let { gap } = this.state;
        let pageOffset = pageWidth + gap;

        this.setState(
            {currentPage: props.currentPage},
            () => {
                this.scrollView.scrollTo({ y: 0, x: (this.state.currentPage) * pageOffset });
            } 
        );

        this.calculateGap(props);
    }

    calculateGap(props) {
        let { sneak, pageWidth } = props;
        if (pageWidth > width) {
            throw new Error("invalid pageWith");
        }
        /*
         ------------
        |            |
        |-   ----   -|
        | | |    | | |
        | | |    | | |
        | | |    | | |
        |-   ----   -|
        |^-- sneak   |
        |         ^--- gap
         ------------

        */
        let gap = (width - (2 * sneak) - pageWidth) / 2;
        this.setState({gap: gap});
    }

    goToPage(position) {
        let { pageWidth, transitionDelay } = this.props;
        let { gap } = this.state;
        let pagePosition = position * (pageWidth + gap);
        // in android, you can't scroll directly in componentDidMount
        // (http://stackoverflow.com/questions/33208477/react-native-android-scrollview-scrollto-not-working)
        // however this doesn't work in android for some reason:
        // InteractionManager.runAfterInteractions(() => {
        //     this.scrollView.scrollTo({ y: 0, x: pagePosition}, true);
        //     console.log('scrollView.scrollTo x:', pagePosition);
        // });
        // So I was left with an arbitrary timeout.
        setTimeout(()=> {
            this.scrollView.scrollTo({ y: 0, x: pagePosition}, true);
        }, transitionDelay);
        this._onPageChange(position);
    }

    handleScrollEnd = (e) => {
        let { pageWidth } = this.props;
        let { gap } = this.state;
        let pageOffset = pageWidth + gap;
        //select page based on the position of the middle of the screen.
        let currentPosition = e.nativeEvent.contentOffset.x + (pageOffset / 2);
        let currentPage = ~~(currentPosition / pageOffset);

        this.scrollView.scrollTo({ y: 0, x: currentPage * pageOffset });
        this._onPageChange(currentPage);
    };

    _onPageChange(position) {
        if (this.props.onPageChange) {
            let currentElement = this.props.children[position];
            this.props.onPageChange(position, currentElement);
        }
    }

    render() {
        let { sneak, pageWidth } = this.props;
        let { gap } = this.state;
        let computedStyles = StyleSheet.create({
            scrollView: {
                paddingLeft: sneak + gap / 2,
                paddingRight: sneak + gap / 2
            },
            page: {
                width: pageWidth,
                justifyContent: "center",
                marginLeft: gap / 2,
                marginRight: gap / 2
            }
        });

        // if no children render a no items dummy page without callbacks
        let body = null;
        if (!this.props.children) {
            body = (
                <TouchableWithoutFeedback>
                    <View style={ [ styles.page, computedStyles.page, this.props.pageStyle ] }>
                        <Text style={ styles.noItemsText }>
                            { this.props.noItemsText }
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            );
        }
        else {
            const children = Array.isArray(this.props.children) ? this.props.children : [this.props.children]
            body = children.map((c, index) => {
                return (
                    <TouchableWithoutFeedback
                        key={ index }
                        onPress={ () => this.goToPage(index) }
                    >
                        <View
                            style={ [ styles.page, computedStyles.page, this.props.pageStyle ] }
                        >
                            { c }
                        </View>
                    </TouchableWithoutFeedback>
                );
            });
        }

        return (
            <View style={ styles.container }>
                <ScrollView
                    automaticallyAdjustContentInsets={ false }
                    bounces
                    contentContainerStyle={ [ computedStyles.scrollView ] }
                    decelerationRate={ 0.9 }
                    horizontal
                    onScrollEndDrag={ this.handleScrollEnd }
                    ref={ c => this.scrollView = c }
                    showsHorizontalScrollIndicator={ false }
                >
                    { body }
                </ScrollView>
            </View>
        );
    }
}
