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

const host = "http://data.iterativ.ch:9200/moods";
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
        <a href={url} target="_blank">
          <img data-qa="poster" className={bemBlocks.item("poster")} src={url} width="200" height="200"/>
          <div data-qa="title" className={bemBlocks.item("title")}>Beauty: {source.beauty}</div>
          <div data-qa="title" className={bemBlocks.item("title")}>Age: {source.age}</div>
        </a>
      </div>
    )
  }
};

export class SearchPage extends React.Component {
	render(){
		return (
			<SearchkitProvider searchkit={searchkit}>
		    <Layout>
		      <TopBar>
		        <SearchBox
		          autofocus={true}
		          searchOnChange={true}
							placeholder="Search faces..."
		          prefixQueryFields={["age", "mood", "beauty"]}/>
		      </TopBar>
		      <LayoutBody>
		        <SideBar>
            <RangeFilter
                id="beauty"
                field="beauty"
                min={0}
                max={100}
                showHistogram={true}
                title="Beauty in %"/>
                <RangeFilter
                    id="age"
                    field="age"
                    min={0}
                    max={100}
                    showHistogram={true}
                    title="Age"/>
							<MenuFilter
								id="mood"
								title="Mood"
								field="mood"
								listComponent={ItemHistogramList}
                size={10}/>
		        </SideBar>
		        <LayoutResults>
		          <ActionBar>
		            <ActionBarRow>
		              <HitsStats/>
                  <ViewSwitcherToggle/>
									<SortingSelector options={[
										{label:"Relevance", field:"_score", order:"desc", defaultOption:true},
										{label:"Latest Releases", field:"released", order:"desc"},
										{label:"Earliest Releases", field:"released", order:"asc"}
									]}/>
		            </ActionBarRow>
		            <ActionBarRow>
		              <SelectedFilters/>
		              <ResetFilters/>
		            </ActionBarRow>
		          </ActionBar>
              <ViewSwitcherHits
                  hitsPerPage={50} highlightFields={["album_title","album_artist"]}
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
