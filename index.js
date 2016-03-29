"use strict";

import React from "react-native";
let {
    Dimensions,
    StyleSheet,
    View,
    ScrollView,
    PropTypes,
    Component,
    TouchableWithoutFeedback
} = React;

import styles from "./styles";

let { width } = Dimensions.get("window");

export default class Carousel extends Component {

    displayName = "Carousel";

    static propTypes = {
        pageStyle: PropTypes.object,
        pageWidth: PropTypes.number,
        children: PropTypes.array,
        initialPage: PropTypes.number,
        onPageChange: PropTypes.func,
        sneak: PropTypes.number
    };

    static defaultProps = {
        initialPage: 0,
        pageStyle: null,
        pageWidth: width - 100,
        sneak: 20
    };

    state = {
        activePage: this.props.initialPage || 0
    };

    componentWillMount() {
        this.calculateGap(this.props);
    }

    componentDidMount() {
        if (this.props.initialPage > 0) {
            this.goToPage(this.props.initialPage);
        }
    }

    componentWillReceiveProps(props) {
        this.calculateGap(props);
    }

    calculateGap(props) {
        /*
         ------------
        |      v--- page
        |-   ----   -|
        | | |    | | |
        | | |    | | |
        | | |    | | |
        |-   ----   -|
        |^-- sneak   |
        |         ^--- gap
         ------------
        */
        let { sneak, pageWidth } = props;
        if (pageWidth > width) {
            throw new Error("invalid pageWith");
        }
        let gap = (width - (2 * sneak) - pageWidth) / 2;
        this.setState({gap: gap});
    }

    goToPage(position) {
        let { pageWidth } = this.props;
        let { gap } = this.state;
        let pagePosition = position * (pageWidth + gap);
        this.scrollView.scrollTo({y: 0, x: pagePosition});
    }

    handleScrollEnd = (e) => {
        let { pageWidth } = this.props;
        let { gap } = this.state;
        let pageOffset = pageWidth + gap;
        //select page based on the position of the middle of the screen.
        let currentPosition = e.nativeEvent.contentOffset.x + (width / 2);
        // var activePage = e.nativeEvent.contentOffset.x;// / this.props.width;
        let currentPage = ~~(currentPosition / pageOffset);
        this.scrollView.scrollTo({y: 0, x: currentPage * pageOffset});
        this.setState({activePage:currentPage});

        if (this.props.onPageChange) {
            this.props.onPageChange(currentPage);
        }
    };

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
        let pages = this.props.children.map((c, index) => {
            return (
                <TouchableWithoutFeedback
                    key={ index }
                    onPress={ ()=> this.goToPage(index) }
                >
                    <View
                        style={ [ styles.page, computedStyles.page, this.props.pageStyle ] }
                    >
                        { c }
                    </View>
                </TouchableWithoutFeedback>
            );
        });

        return (
            <View style={ { flex: 1 } }>
                <ScrollView
                    automaticallyAdjustContentInsets={ false }
                    bounces
                    contentContainerStyle={ [ styles.container, computedStyles.scrollView ] }
                    decelerationRate={ 0.9 }
                    horizontal
                    onScrollEndDrag={ this.handleScrollEnd }
                    ref={ c => this.scrollView = c }
                    showsHorizontalScrollIndicator={ false }
                >
                    { pages }
                </ScrollView>
            </View>
        );
    }
}
