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
          <img data-qa="face" className={bemBlocks.item("face")} src={url} width="200" height="200"/>
          <div data-qa="title" className={bemBlocks.item("title")}>{source.gender}, {source.age}yrs, B:{source.beauty}%, H:{source.happiness}%</div>
      </div>
    )
  }
};

export class SearchPage extends React.Component {
	render(){
		return (
			<SearchkitProvider searchkit={searchkit}>
		    <Layout>
		      {/*<TopBar>
          <img src="logo.png" alt="logo" />
		       </TopBar>*/}
		      <LayoutBody>
		        <SideBar>
        <div  className="btn-add"><a class="animate" href="/upload">Photo Booth</a></div>
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
