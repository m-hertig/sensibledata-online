import * as React from "react";
import * as _ from "lodash";

import {
    SearchkitManager, SearchkitProvider,
    SearchBox, RefinementListFilter, MenuFilter, RangeFilter,
    Hits, HitsStats, NoHits, Pagination, SortingSelector,
    SelectedFilters, ResetFilters, ItemHistogramList,
    Layout, LayoutBody, LayoutResults, TopBar, ItemCheckboxList, TagCloud,
    SideBar, ActionBar, ActionBarRow, InputFilter, PageSizeSelector, Toggle,
    Tabs, ItemList, CheckboxItemList, DynamicRangeFilter, ViewSwitcherToggle, ViewSwitcherHits
} from "searchkit";

require("./index.scss");


const customHitStats = (props) => {
    const {resultsFoundLabel, bemBlocks, hitsCount, timeTaken} = props
    return (
        <div className={bemBlocks.container()} data-qa="hits-stats">
            <div className={bemBlocks.container("info")} data-qa="info">
                {hitsCount} People found
            </div>
      </div>
    )
}


const host = "https://search-sensibledata-mnmvjeckzqxbuqjpnrlamqgxhu.eu-central-1.es.amazonaws.com/faces";
const searchkit = new SearchkitManager(host);

const AlbumHitsGridItem = (props)=> {
  const {bemBlocks, result} = props;

  if (result) {
    const source:any = _.extend({}, result._source, result.highlight);
    //let url = "http://idowebsites.ch/sensibleData/images/" + source.file;
    let url = source.file;

    console.log(source);

    return (
      <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
          <img data-qa="face" className={bemBlocks.item("face")} src={url}/>
          <div data-qa="title" className={bemBlocks.item("title")}>{source.gender}, {source.age}yrs, B:{source.beauty}%, H:{source.happiness}%</div>
      </div>
    )
  }
};




export class SearchPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = { showFilters: "hideFilters" };
    this.state = { showInfos: false };
    this.handleFilterClick = this.handleFilterClick.bind(this);
    this.handleInfoClick = this.handleInfoClick.bind(this);
  }

  handleFilterClick() {
    var css = (this.state.showFilters === "showFilters") ? "hideFilters" : "showFilters";
    this.setState({ showFilters: css });
}

  handleInfoClick() {
    this.setState({ showInfos: !this.state.showInfos });
  }

	render(){
		return (
			<SearchkitProvider searchkit={searchkit}>
		    <Layout>
		      {/*<TopBar>
          <img src="logo.png" alt="logo" />
		       </TopBar>*/}
		      <LayoutBody>
            <SideBar className={this.state.showFilters}>
            <div className="filter-buttons">
      <div  className="btn-add"><a href="/upload">Take a picture</a></div><div className="btn-filter" onClick={ this.handleFilterClick }></div>
              </div>
                            <span className="sidebar-filters">
            <RangeFilter
                id="beauty"
                field="beauty"
                min={0}
                max={100}
                showHistogram={true}
            title="Beauty %"/>
            <RangeFilter
                id="age"
                field="age"
                min={0}
                max={100}
                showHistogram={true}
                title="Age"/>
            <RangeFilter
                id="happiness"
                field="happiness"
                min={0}
                max={100}
                showHistogram={true}
                title="Happiness %"/>
							<MenuFilter
								id="gender"
								title="Gender"
								field="gender"
								listComponent={ItemHistogramList}
                size={2}/>
                </span>
		        </SideBar>
		        <LayoutResults>
		          <ActionBar>
		            <ActionBarRow>
		              <HitsStats component={customHitStats}/>
                  <ViewSwitcherToggle/>
									<SortingSelector options={[
										{label:"Newest first", field:"timestamp", order:"desc", defaultOption:true},
										{label:"Beauty low to high", field:"beauty", order:"asc"},
										{label:"Beauty high to low", field:"beauty", order:"desc"}
									]}/>
		            </ActionBarRow>
		            <ActionBarRow>
		              <SelectedFilters/>
		              <ResetFilters/>
		            </ActionBarRow>
		          </ActionBar>
              <ViewSwitcherHits
                  hitsPerPage={50}
                  hitComponents={[
                      {key:"grid", title:"Grid", itemComponent:AlbumHitsGridItem, defaultOption:true}
                  ]}
                  scrollTo="body" />
		          <NoHits/>
							<Pagination showNumbers={true}/>
		        </LayoutResults>
		      </LayoutBody>
		    </Layout>
		  </SearchkitProvider>
		)
	}
}
