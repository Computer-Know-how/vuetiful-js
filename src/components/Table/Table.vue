<template>
	<div class="table">
		<div v-if="tableData && tableData.rows && tableData.rows.length > 0" :style="`minWidth: ${minWidth}; maxWidth: ${maxWidth};`">
			<!-- Table Tools -->
			<div class="table__tools flex-c-s" v-if="enableTools">
				<table-input v-if="enableSearch" class="tools__tools--search" v-model="searchValue" placeholder="Search" prefixIcon="icon --search"></table-input>
			</div>

			<!-- Table -->
			<div :class="`table ${tableBorder}`" :style="`minWidth: ${minWidth}; maxWidth: ${maxWidth};`">
				<!-- Table Header -->
				<div
					v-if="headerInfirstRow"
					:class="`table__row flex-c is-header ${rowStripe} ${tableBorder}`"
					:style="`height: ${headerHeight}px; ${headerDropShadow ? 'box-shadow:' + headerDropShadow + '; border-bottom: none;' : ''}`"
					@click="onClickRow(tableData.rows[0], 0)">
					<!-- "Check All" checkbox -->
					<div
						v-if="showCheck"
						:class="`table__check flex-c-c ${tableBorder}`"
						:style="`backgroundColor: ${isHighlighted(0, NaN) ? highlightedColor : 'transparent'}`">
						<div :class="`table__check--all flex-c-c ${ tableData.rows[0].checked ? 'is-checked' : '' }`" @click.stop="onCheckAll(tableData.rows[0])">
							<i class="icon --check" v-show="tableData.rows[0].checked === true"></i>
							<i class="icon --minus" v-show="tableData.rows[0].checked === 'indeterminate'"></i>
						</div>
					</div>

					<!-- Table Header cells -->
					<div
						v-for="(tableCell, j) in tableData.rows[0].cells"
						:key="j"
						:style="getCellStyle(0, j)"
						:class="`table__cell flex-c-s is-header ${tableBorder}`"
						@click="onClickCell(tableCell, 0, j)">
						<span
							class="table__cell-content"
							:style="`white-space: ${whiteSpace}; overflow-wrap: ${wordWrap}; text-overflow: ${textOverflow}; font-size: ${headerFontSize}px;`">
							<b>{{ tableCell.data }}</b>
						</span>

						<span class="table-sort flex-dir-column" :style="`height: ${rowHeight} `">
							<i
							:class="`sort--btns sort--descending ${activatedSort[j] && activatedSort[j] === 'descending' ? 'activated' : '' }`"
							@click.stop="onSort(j, 'descending')"></i>
							<i
							:class="`sort--btns sort--ascending ${activatedSort[j] && activatedSort[j] === 'ascending' ? 'activated' : '' }`"
							@click.stop="onSort(j, 'ascending')"></i>
						</span>
						
						<!-- TODO: add filtering functionality -->
					</div>
				</div>

				<!-- Table Body -->
				<div class="table-body" :style="{ height: height }">
					<!-- Table Body rows -->
					<div v-for="(tableRow, i) in tableData.rows" :key="i">
						<div
							v-show="tableRow.show && !tableRow.filtered && !(pagination && !tableRow.inPage) && !(i === 0 && headerInfirstRow)"
							:id="`table__row-${tableRow.index}`"
							:class="`table__row flex-c ${rowStripe && i % 2 === 0 ? 'is-striped' : ''} ${tableBorder}`"
							:style="{ height: rowHeight + 'px' }"
							@click="onClickRow(tableRow, tableRow.index)">
							<!-- Row checkbox -->
							<div
								v-if="showCheck"
								:class="`table__check flex-c-c ${tableBorder}`"
								:style="{ backgroundColor: isHighlighted(tableRow.index, NaN) ? highlightedColor : 'transparent' }">
									<div
										class="table__check--row flex-c-c"
										:class="{ 'is-checked': tableRow.checked }"
										@click.stop="onCheckRow(tableRow, tableRow.index)">
											<i class="icon --check" v-show="tableRow.checked"></i>
								</div>
							</div>

							<!-- Table Body cells -->
							<div
								v-for="(tableCell, j) in tableRow.cells"
								:key="j"
								:id="`table__cell-${j}`"
								:class="`table__cell flex-c-s ${tableBorder} ${Array.isArray(tableCell.data) ? '--multi-cell' : '' } ${getCellStyle(tableRow.index, j, true)}`"
								:style="getCellStyle(tableRow.index, j)"
								@click="onClickCell(tableCell, tableRow.index, j)"
							>
								<div
									v-if="Array.isArray(tableCell.data) && tableCell.data.length > 2"
									@click="expandCell($event, tableRow.index, tableCell, j)"
									class="expand-arrow"
								>
									<span><i class="icon --down"></i></span>
								</div>
								<span
									v-if="typeof tableCell.data == 'string'"
									:class="`table__cell-content ${ i !== 0 ? 'fill-width' : '' }`"
									:style="`white-space: ${whiteSpace}; overflow-wrap: ${wordWrap}; text-overflow: ${textOverflow};`"
									:contenteditable="isEditable(tableRow.index, j)"
									:id="tableCell.key"
									@blur="onCellBlur(tableCell, tableRow.index, j)"
									@keydown.enter.stop.prevent="onCellKeyEnter"
								>
									{{ tableCell.data }}
								</span>
								<div
									v-else-if="Array.isArray(tableCell.data)"
									v-for="[index, item] in Object.entries(tableCell.data)"
									:key="index"
									:class="`table__cell-content --multi-cell ${ i !== 0 ? 'fill-width' : '' }`"
									:style="`white-space: ${whiteSpace}; overflow-wrap: ${wordWrap}; text-overflow: ${textOverflow};`"
									:contenteditable="isEditable(tableRow.index, j)"
									:id="tableCell.key"
									@blur="onCellBlur(tableCell, tableRow.index, j)"
									@keydown.enter.stop.prevent="onCellKeyEnter"
								>
									<p>{{ item.value }}</p>
								</div>
								<!-- TODO: decide whether or not to implement layered cells (cell title, subtitle etc.) -->
								<!-- <span style="width: 100%;">
									{{ tableCell.data }}
								</span> -->
							</div>

							<!-- Quick peek button -->
							<div :class="`table__select--link flex-c-c ${tableBorder}`">
								<button v-if="quickPeekEnabled" @click="quickPeek(tableRow.index)">quick peek</button>
							</div>

							<!-- Row select button -->
							<div
								v-if="selectableRows"
								:class="`table__select flex-c-c ${tableBorder}`">
									<button
										class="btn --primary flex-c-c"
										:class="{ 'is-selected': tableRow.selected }"
										@click.stop="onSelectRow(tableRow, tableRow.index)">
										{{ tableRow.selected ? 'Deselect' : 'Select' }}
									</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<quick-peek
			v-if="quickPeekEnabled && quickPeekArr.length"
			:quickPeekArr="quickPeekArr"
			:headers="quickPeekHeaders"
			:data="quickPeekHeaders.reduce((agg, cur, idx) => { agg[cur] = this.quickPeekArr[0][idx]; return agg; }, {})"
			:headingValue="this.quickPeekArr[0][quickPeekRowHeadingIndex]"
			:subHeadingValue="this.quickPeekArr[0][quickPeekRowSubHeadingIndex]"
			@exit="exitQuickPeek"
		></quick-peek>
	</div>
</template>

<script>
import { populatedArray, is2DMatrix } from '../../utils/array.js';
import { generateUnique } from '../../utils/generateUnique.js';

// Components
import Input from '../Input/Input.vue';
import QuickPeek from '../QuickPeek/QuickPeek.vue';

// Statics
const wordWrapList = [ 'normal', 'break-word' ];
const whiteSpaceList = [ 'nowrap', 'normal', 'pre', 'pre-wrap', 'pre-line' ];
const textOverflowList = [ 'clip', 'ellipsis' ];

export default {
	name: 'vuetiful-table',
	data() {
		return {
			tableData           : {},
			searchValue         : '',
			activatedSort       : {},
			totalPages          : 0,
			pageSize            : 0,
			quickPeekArr        : [],
		};
	},
	props: {
		/*
			params.data             : (Array) Tabular data
			params.header           : (String) header type. 'row': the first row is used as the header; 'column': the first column is used as the header; '' / 'none' / other: no header. Default None
			params.border           : (Boolean) Whether to have a border. Without default
			params.stripe           : (Boolean) The background interval stripes are displayed. Default false
			params.highlight        : (Object) configure row / column / table cells for the highlighted background
			params.highlightedColor : (String) The color of the highlighted background.
			params.wordWrap         : (String) long word wrap for text in table cells 'normal / break-word' default normal
			params.whiteSpace       : (String) white space for text in table cells 'nowrap / normal / pre / pre-wrap / pre-line' default nowrap
			params.textOverflow     : (String) text overflow handling in table cells 'clip / ellipsis' default clip
			params.showCheck        : (Boolean) Whether to show a multi-select (check) box before the first column. Not displayed by default. Note: Only when params.header is' row, the first row and the first column are 'select all' boxes, otherwise the first column is the check box of the current row
			params.enableSearch     : (Boolean) Enable search. Disabled by default
			params.minWidth         : (Number) The minimum width of the table. Default 300
			params.maxWidth         : (Number) The maximum width of the table. Default 1000
			params.height           : (Number) table height.
			params.headerHeight     : (Number) table row height. Default 30
			params.rowHeight        : (Number) table row height. Default 30
			params.columnWidth      : (Array) specifies the width of one or more columns, and the remaining column widths are evenly divided. [{column: 0, width: 80}, {column: 1, width: '20% '}]
			params.sort             : (Array) specifies sorting based on a column. Sort by specifying the first and second columns: [0, 1]. Only valid when the first row is configured as a table header
			params.edit             : (Object) configures editable row / column / table cells. For example: {row: [2, 3, ...], column: [3, 4, ...], cell: [[4, 4], [5, 6], ...]}; negative numbers indicate Reverse order (eg -1 is the last row / column); row: 'all' all rows
			Editing will change the data displayed in the table and will not change the incoming source data. When the component method is called to obtain the table data, the edited data is returned. The header is not editable. Disabled by default
			params.filter           : (Array) configure column-based filtering. For example: [{column: 0, content: [{text: '> 5', value: 5}], method: (value, tableCell) => {...}}]
			params.pagination       : (Boolean) Whether to enable pagination. Default false
			params.pageSize         : (Number) shows the number of pages per page
			params.pageSizes        : (Array) optional value for displaying the number of pages per page
		*/
		params: {
			type: Object,
			default: () => { return {}; }
		}
	},
	computed: {
		sourceData         () { return (Array.isArray(this.params.data)) ? this.params.data : [];                                                                             },
		tableBorder        () { return (this.params.border) ? 'show-border' : '';                                                                                        		 },
		selectableRows     () { return (this.params.selectable) ? true : false;                                                                                        		 },
		fixedColumns     () { return (this.params.fixedColumns) ? this.params.fixedColumns : [];                                                                                 },
		quickPeekEnabled   () { return (this.params.quickPeekConfig) ? true : false;                                                                                        		 },
		quickPeekHeaders   () { return (this.params.quickPeekConfig && this.params.quickPeekConfig.headers) ? this.params.quickPeekConfig.headers : [];                  		 },
		quickPeekRowHeadingIndex   () { return (this.params.quickPeekConfig && this.params.quickPeekConfig.rowHeadingIndex) ? this.params.quickPeekConfig.rowHeadingIndex : 0;                  		 },
		quickPeekRowSubHeadingIndex   () { return (this.params.quickPeekConfig && this.params.quickPeekConfig.rowSubHeadingIndex) ? this.params.quickPeekConfig.rowSubHeadingIndex : 1;                  		 },
		rowStripe          () { return (this.params.rowStripe) ? 'is-striped' : '';                                                                                           },
		highlightConfig    () { return (this.params.highlight && typeof this.params.highlight === 'object') ? this.params.highlight : {};                                     },
		highlightedColor   () { return (this.params.highlightedColor && typeof this.params.highlightedColor === 'string') ? this.params.highlightedColor : '#000000';         },
		headerInfirstRow   () { return !!(this.params.header === 'row');},
		wordWrap           () { return (this.params.wordWrap && wordWrapList.includes(this.params.wordWrap)) ? this.params.wordWrap : wordWrapList[0];                        },
		whiteSpace         () { return (this.params.whiteSpace && whiteSpaceList.includes(this.params.whiteSpace)) ? this.params.whiteSpace : whiteSpaceList[0];              },
		textOverflow       () { return (this.params.textOverflow && textOverflowList.includes(this.params.textOverflow)) ? this.params.textOverflow : textOverflowList[0];    },
		showCheck          () { return !!(this.params.showCheck);                                                                                                             },
		enableSearch       () { return !!(this.params.enableSearch);                                                                                                          },
		enableTools        () { return !!(this.params.enableTools);                                                                                                           },
		minWidth           () { return (typeof this.params.minWidth === 'number' && this.params.minWidth > 0) ? this.params.minWidth : '100%';                                   },
		maxWidth           () { return (typeof this.params.maxWidth === 'number' && this.params.maxWidth > 0) ? this.params.maxWidth : '1600px';                                  },
		height             () { return (typeof this.params.height === 'number' && this.params.height > this.rowHeight) ? this.params.height - this.rowHeight + 'px' : 'auto'; },
		headerHeight       () { return (typeof this.params.headerHeight === 'number' && this.params.headerHeight >= 24) ? this.params.headerHeight : 30;                      },
		headerFontSize     () { return (typeof this.params.headerFontSize === 'number') ? this.params.headerHeight : 14;                                                      },
		headerDropShadow   () { return (this.params.headerBoxShadow) ? this.params.headerBoxShadow : false;                                                                   },
		rowHeight          () { return (typeof this.params.rowHeight === 'number' && this.params.rowHeight >= 24) ? this.params.rowHeight : 30;                               },
		sortConfig         () { return (this.params.header === 'row' && Array.isArray(this.params.sort)) ? this.params.sort : [];                                             },
		editConfig         () { return (this.params.edit && typeof this.params.edit === 'object') ? this.params.edit : {};                                                    },
		pagination         () { return !!(this.params.pagination);                                                                                                            },
		pageConfig         () { return (typeof this.params.pageSize === 'number' &&this.params.pageSize > 0) ? this.params.pageSize : 10;                                     },
		pageSizes          () { return (Array.isArray(this.params.pageSizes)) ? this.params.pageSizes : [10, 20, 50, 100];                                                    },
		cellStyle          () { return (Array.isArray(this.params.cellStyle)) ? this.params.cellStyle : [];                                                    },
		columnWidth() {
			if (populatedArray(this.params.columnWidth)) {
				const obj = {};

				this.params.columnWidth.forEach(c => {
					if (c && typeof c.column === 'number' && c.column >= 0) {
						if (typeof c.width === 'number' && c.width >= 0) {
							obj[c.column] = c.width + 'px';
						} else if (typeof c.width === 'string' && /^(\d+\.?\d+?)%$/.test(c.width)) {
							obj[c.column] = c.width;
						}
					}
				});

				return obj;
			}

			return {};
		},
		filterConfig() {
			if (populatedArray(this.params.filter)) {
				const filterObj = {};

				this.params.filter.forEach(f => {
					if (
						f && typeof f.column === 'number'
						&& f.column >= 0
						&& typeof f.method === 'function'
						&& populatedArray(f.content)
					) {
						if (f.content.every(c => c && typeof c.text === 'string' && typeof c.value !== 'undefined')) {
							const content = f.content.map(c => new Object({ ...c, checked: false, key: generateUnique('content-') }));
							filterObj[f.column] = { ...f, content, key: generateUnique('filter-') };
						}
					}
				});

				return filterObj;
			}

			return {};
		},
	},
	watch: {
		params: {
			handler() {
				this.searchValue = '';
				this.activatedSort = {};
			},
			deep: true,
			immediate: true
		},
		sourceData: {
			handler() { this.initData(); },
			deep: true,
			immediate: true
		},
		searchValue(value) {
			if (!this.enableSearch) return;
			this.search(value);
		},
		headerInfirstRow(value) {
			if (value && this.tableData && this.tableData.rows.length) {
				this.tableData.rows[0].checked = false;
				this.tableData.rows[0].show = true;
			}
		},
		enableSearch(newVal, oldVal) { if (oldVal && !newVal) this.clearSearch(); },
		pageSizeConfig: {
			handler(v) { if (v > 0 && this.pageSize !== v && this.params.pagination) this.pageSize = v; },
			immediate: true
		}
	},
	beforeDestroy() {
		this.tableData = {};
		this.activatedSort = {};
	},
	methods: {
		/**
		 * @function - Initialize Table data
		 */
		initData() {
			if (is2DMatrix(this.sourceData)) {
				const table = {
					key: generateUnique('table-'),
					checked: false,
					selected: false,
					rows: [],
					filteredRows: {}
				};

				for (let i = 0; i < this.sourceData.length; i++) {
					const tableRow = {
						key: generateUnique('table-'),
						checked: false,
						selected: false,
						show: true,
						filtered: false,
						inPage: false,
						index: i
					};

					tableRow.cells = this.sourceData[i].map(item => new Object({ data: item, key: generateUnique('table-'), checked: false, selected: false }));
					table.rows.push(tableRow);
				}

				this.tableData = table;
				this.$nextTick(this.updatePagination);
			}
		},
		/**
		 * @function - Update paginated data
		 */
		updatePagination() {
			if (!this.pagination || !(this.tableData && this.tableData.rows && this.tableData.rows.length > 0)) return;

			const rowNum = this.getActivatedRowNum();
			if (rowNum === this.totalPages) {
				if (this.$refs && this.$refs.tablePagination) {
					this.$refs.tablePagination.initPages(this.totalPages);
				}
			} else {
				this.totalPages = rowNum;
			}
		},
		/**
		 * @function - Current page number changed
		 * @param {Number} page - Page Number
		 */
		onPageChange(page) {
			if (!this.pagination || !(this.tableData && this.tableData.rows && this.tableData.rows.length > 0)) return;

			const start = (page - 1) * this.pageSize;
			const end = start + this.pageSize;
			const rows = this.tableData.rows.filter((row, index) => (index === 0 && this.headerInfirstRow) ? false : row.show && !row.filtered);

			rows.forEach((row, index) => row.inPage = !!(index >= start && index < end));
		},
		/**
		 * @function - Display number of events per page
		 */
		onPageSizeChange(size) {
			if (!this.pagination) return;
			this.pageSize = size;
		},
		/**
		 * @function - Jump to the target page
		 * @param {Number} targetPage - Target Page
		 */
		toPage(targetPage) {
			if (!this.pagination || !(typeof targetPage === 'number' && targetPage > 0)) return;
			if (this.$refs && this.$refs.tablePagination) this.$refs.tablePagination.toPage(targetPage);
		},
		/**
		 * @function - Get style data of Cell
		 */
		getCellStyle(rowIndex, columnIndex, getClass) {
			const style = (this.cellStyle.find(cur => {
				if (
					cur.exclude
					&& cur.exclude.some(r => r.row == rowIndex || r.column == columnIndex)
				) return false;

				return (cur.column && cur.row)
					? cur.column == columnIndex && cur.row == rowIndex
					: (cur.column)
						? cur.column == columnIndex
						: (cur.row)
							? cur.row == rowIndex
							: false;
			}) || {}).style || {};

			if (getClass && style && style.class) return style.class;
			else if (getClass) return '';

			if (this.isHighlighted(rowIndex, columnIndex) && style) style.backgroundColor = this.highlightedColor;

			return (this.columnWidth[columnIndex]) ? {
				...style,
				flexGrow: 0,
				flexShrink: 0,
				flexBasis: this.columnWidth[columnIndex]
			} : {
				...style,
				flexGrow: 1,
				flexShrink: 1,
				flexBasis: '0%'
			};
		},
		/**
		 * @function - Checks if the cell is editable
		 * @param {Number} rowIndex - Row index
		 * @param {Number} columnIndex - Column index
		 */
		isEditable(rowIndex, columnIndex) {
			if (
				!(this.editConfig && (this.editConfig.row || this.editConfig.column || this.editConfig.cell))
			) return false;

			if (
				this.editConfig.row === 'all' ||
				this.editConfig.column === 'all' ||
				this.editConfig.cell === 'all'
			) return true;

			if (
				Array.isArray(this.editConfig.row)
				&& (this.editConfig.row.includes(rowIndex)
				|| this.editConfig.row.includes(rowIndex - this.sourceData.length))
			) return true;

			if (
				Array.isArray(this.editConfig.column)
				&& (this.editConfig.column.includes(columnIndex)
				|| this.editConfig.column.includes(columnIndex - this.sourceData[0].length))
			) return true;

			if (
				Array.isArray(this.editConfig.cell)
				&& this.editConfig.cell.length > 0
			) {
				return this.editConfig.cell.some(item => (
					Array.isArray(item)
					&& item.length >= 2
					&& (item[0] === rowIndex || item[0] === rowIndex - this.sourceData.length)
					&& (item[1] === columnIndex || item[1] === columnIndex - this.sourceData[0].length)
				));
			}

			return false;
		},
		isHighlighted(rowIndex, columnIndex) {
			if (
				!this.highlightConfig
				|| (this.highlightConfig.row && this.highlightConfig.column && this.highlightConfig.cell)
			) return false;

			if (
				Array.isArray(this.highlightConfig.row)
				&& (this.highlightConfig.row.includes(rowIndex)
				|| this.highlightConfig.row.includes(rowIndex - this.sourceData.length))
			) return true;

			if (
				Array.isArray(this.highlightConfig.column)
				&& (this.highlightConfig.column.includes(columnIndex) || this.highlightConfig.column.includes(columnIndex - this.sourceData[0].length))
			) return true;

			if (
				Array.isArray(this.highlightConfig.cell) &&
				this.highlightConfig.cell.length > 0
			) {
				return this.highlightConfig.cell.some(item => (
					Array.isArray(item)
					&& item.length >= 2
					&& (item[0] === rowIndex || item[0] === rowIndex - this.sourceData.length)
					&& (item[1] === columnIndex || item[1] === columnIndex - this.sourceData[0].length)
				));
			}

			return false;
		},
		/**
		 * @function - Check all rows
		 * @param {Object} tableRow - First row header
		 */
		onCheckAll(tableRow) {
			if (!this.showCheck) return;

			let allChecked = tableRow.checked !== true;

			this.setAllRowChecked(allChecked);
			this.$emit('select-all', allChecked);
			this.$emit('selectionChange', this.getRowDatas(true, 'checked'), this.getCheckedRowIndices(true), this.getCheckedRowNum(true));
		},
		/**
		 * @function - Check a single row
		 * @param {Object} tableRow - Row Data object
			* @param {Number} rowIndex - Row index
		 */
		onCheckRow(tableRow, rowIndex) {
			if (!this.showCheck) return;

			tableRow.checked = !tableRow.checked;

			if (this.headerInfirstRow) {
				if (this.isAllRowChecked()) {
					this.tableData.rows[0].checked = true;
				} else if (this.getCheckedRowNum() > 0) {
					this.tableData.rows[0].checked = 'indeterminate';
				} else {
					this.tableData.rows[0].checked = false;
				}
			}

			this.$emit('select', tableRow.checked, rowIndex, this.getRowDataFromTableRow(tableRow));
			this.$emit('selectionChange', this.getRowDatas(true, 'checked'), this.getCheckedRowIndices(true), this.getCheckedRowNum(true));
		},
		onSelectRow(tableRow) {
			if (!this.selectableRows) return;

			tableRow.selected = !tableRow.selected;
			this.$emit('selectionChange', this.getRowDatas(true, 'selected'));
		},
		/**
		 * @function - Click Row Event
		 * @param {Object} tableRow - Row data object
		 * @param {Number} rowIndex - Row index
		 */
		onClickRow(tableRow, rowIndex) {
			this.$emit('row-click', rowIndex, this.getRowDataFromTableRow(tableRow));
		},
		/**
		 * @function - Click Cell event
		 * @param {Object} tableCell Cell Data Object
		 * @param {Number} rowIndex - Row index
		 * @param {Number} columnIndex - Column index
		 */
		onClickCell(tableCell, rowIndex, columnIndex) {
			this.$emit('cell-click', rowIndex, columnIndex, tableCell.data);
		},
		/**
		 * @function - Cell loses focus
		 * @param {Object} tableCell CellData object
		 * @param {Number} rowIndex - Row index
		 * @param {Number} columnIndex - Column index
		 */
		onCellBlur(tableCell, rowIndex, columnIndex) {
			if (!this.isEditable(rowIndex, columnIndex)) return;

			const cellElement = document.querySelector(`#${tableCell.key}`);
			if (cellElement && tableCell.data !== cellElement.innerHTML.trim()) {
				tableCell.data = cellElement.innerHTML.trim();
				this.$emit('cell-change', rowIndex, columnIndex, tableCell.data);
			}
		},
		// TODO: Add function to handle cell input
		onCellKeyEnter() {},
		/**
		 * @function sort based on a certain column of data
		 * @param {Number} index - Column index
		 * @param {String} value - ascending: ascending; descending: descending
		 */
		onSort(index, value) {
			if (
				!(this.tableData && this.tableData.rows && this.tableData.rows.length > 0)
				|| !this.headerInfirstRow
				|| this.activatedSort[index] === value
			) return;

			this.activatedSort = {};
			this.activatedSort[index] = value;

			this.tableData.rows.sort((row1, row2) => {
				if (row1.index === 0) return -1;
				if (row2.index === 0) return 1;

				const data1 = row1.cells[index].data;
				const data2 = row2.cells[index].data;

				return (value === 'ascending') ? data1 > data2 ? 1 : -1 : data2 > data1 ? 1 : -1;
			});

			this.$emit('sort-change', index, value);
			this.$nextTick(this.updatePagination);
		},
		/**
		 * @function filter based on a certain column of data
		 * @param {Number} columnIndex - Column index
		 * @param {Array} checked - Selected filters
		 * @param {Object} config - Filter configuration for this column
		 */
		onFilter(columnIndex, checked, config) {
			if (!(this.tableData && this.tableData.rows)) return;

			const filteredArr = [];
			this.tableData.rows.forEach(row => {
				if (row && row.cells && row.cells[columnIndex]) {
					const matched = checked.some(item => config.method(item.value, row.cells[columnIndex]));
					matched ? '' : filteredArr.push(row.index);
				}
			});

			this.tableData.filteredRows[columnIndex] = filteredArr;
			this.updateFilteredRows();
		},
		/**
		 * @function - Update row filtering status
		 */
		updateFilteredRows() {
			this.tableData.rows.forEach(row => {
				row.filtered = !!Object.keys(this.tableData.filteredRows).some(key => this.tableData.filteredRows[key].includes(row.index));
			});

			this.$nextTick(this.updatePagination);
		},
		/**
		 * @function - Clear filter status
		 * @param {Number} columnIndex - Column index. When the column index is passed in, the column is cleared; when the index is not passed, all filters are cleared
		 */
		clearFilter(columnIndex) {
			if (typeof columnIndex === 'number') {
				delete this.tableData.filteredRows[columnIndex];
				if (this.filterConfig && this.filterConfig[columnIndex]) {
					this.filterConfig[columnIndex].content.forEach(c => c.checked = false);
				}
			} else {
				this.tableData.filteredRows = {};
				Object.keys(this.filterConfig).forEach(key => this.filterConfig[key].content.forEach(c => c.checked = false));
			}

			this.updateFilteredRows();
		},
		/**
		 * @function - Search by keyword, showing matching lines
		 * @param {String} searchValue - Keywords
		 */
		search(searchValue) {
			if (!(this.tableData && this.tableData.rows)) return;

			searchValue = String(searchValue);
			this.tableData.rows.forEach(row => {
				if (row && row.cells) {
					if (!searchValue) {
						row.show = true;
						return;
					}

					const matched = row.cells.some(cell => String(cell.data).toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()));
					row.show = !!matched;
				}
			});

			this.$nextTick(this.updatePagination);
		},
		/**
		 * @function - Cancel search filtering
		 */
		clearSearch() {
			if (!(this.tableData && this.tableData.rows)) return;
			this.tableData.rows.forEach(row => row ? (row.show = true) : '');
		},
		/**
		 * @function - Get the number of selected rows
		 * @param {Boolean} includeWhenHeaderInfirstRow - Whether to check the header of the first line. Default false
		 */
		getCheckedRowNum(includeWhenHeaderInfirstRow = false) {
			if (!this.showCheck) return 0;

			if (this.tableData && populatedArray(this.tableData.rows)) {
				let num = 0;

				this.tableData.rows.forEach((row, index) => {
					if (index === 0 && this.headerInfirstRow) {
						if (!includeWhenHeaderInfirstRow) return;
						if (row.checked !== false) return num++;
					}

					if (row.checked) num++;
				});

				return num;
			}

			return 0;
		},
		/**
		 * @function - Get the original index of the selected row (before sorting). The returned index list has nothing to do with whether to sort
		 * @param {Boolean} includeWhenHeaderInfirstRow - Whether to check the header of the first line. Default false
		 */
		getCheckedRowIndices(includeWhenHeaderInfirstRow = false) {
			if (!this.showCheck) return [];

			if (this.tableData && populatedArray(this.tableData.rows)) {
				const indices = [];
				this.tableData.rows.forEach((row, index) => {
					if (index === 0 && this.headerInfirstRow) {
						if (!includeWhenHeaderInfirstRow) return;
						if (row.checked !== false) return indices.push(row.index);
					}

					if (row.checked) indices.push(row.index);
				});

				return indices;
			}

			return [];
		},
		/**
		 * @function - Get the original index of the selected row
		 */
		getSelectedRowIndices() {
			if (!this.selectableRows) return [];

			if (this.tableData && populatedArray(this.tableData.rows)) {
				const indices = [];
				this.tableData.rows.forEach((row) => { if (row.selected) indices.push(row.index); });

				return indices;
			}

			return [];
		},
		/**
		 * @function - Get the data of the selected row (2DMatrix)
		 * @param {Boolean} includeWhenHeaderInfirstRow - Whether to check the header of the first line
		 */
		getRowDatas(includeWhenHeaderInfirstRow = false, type) {
			const indices = type == 'checked' ? this.getCheckedRowIndices(includeWhenHeaderInfirstRow) : this.getSelectedRowIndices();
			const data = this.getData(indices);
			return data || [];
		},
		/**
		 * @function - Get the latest data of the table. You can specify to include only the specified rows, or to include all data if you do not specify. Row order is initial order
		 * @param {Array} rowIndices - Specify the line. Such as：[ 0, 1, 2, ... ]
		 */
		getData(rowIndices) {
			const matrix = [];

			if (this.tableData && populatedArray(this.tableData.rows)) {
				const tmpRows = {};

				this.tableData.rows.forEach((row) => {
					(Array.isArray(rowIndices))
						? (rowIndices.includes(row.index)) ? tmpRows[row.index] = row : ''
						: tmpRows[row.index] = row;
				});

				for (let i = 0; i < this.tableData.rows.length; i++) {
					let rowData = this.getRowDataFromTableRow(tmpRows[i]);
					if (rowData.length > 0) matrix.push(rowData);
				}
			}

			return matrix;
		},
		/**
		 * @function - Get the latest data for the specified row based on the row index
		 * @param {Number} rowIndex - Row index
		 * @param {Boolean} isCurrent - Whether the index is a sorted index. Default false, that is, the original index
		 */
		getRowData(rowIndex, isCurrent = false) {
			if (this.tableData && populatedArray(this.tableData.rows)) {
				const row = (isCurrent) ? this.tableData.rows[rowIndex] : this.tableData.rows.find(r => r.index === rowIndex);
				return this.getRowDataFromTableRow(row);
			}

			return [];
		},
		/**
		 * @function - Get the latest data of the specified Cell according to the row and column indices
		 * @param {Number} rowIndex - Row index
		 * @param {Number} columnIndex - Column index
		 * @param {Boolean} isCurrent - Whether the row index is a sorted index. Default false, that is, the original index
		 */
		getCellData(rowIndex, columnIndex, isCurrent = false) {
			if (this.tableData && populatedArray(this.tableData.rows)) {
				const row = (isCurrent) ? this.tableData.rows[rowIndex] : this.tableData.rows.find(r => r.index === rowIndex);
				if (!(row && populatedArray(row.cells))) return '';

				const cell = row.cells[columnIndex];
				if (cell && typeof cell.data !== 'undefined') return cell.data;

				return '';
			}

			return '';
		},
		/**
		 * @function - Gets the data of this row according to tableRow (internal row object). {key: 'xxx', cells: [...]} ==> [...]
		 * @param {Number} tableRow - Internal row object. { key: 'xxx', cells:[ ... ] }
		 */
		getRowDataFromTableRow(tableRow) {
			const rowData = [];
			if (!(tableRow && populatedArray(tableRow.cells))) return rowData;

			for (let i = 0; i < tableRow.cells.length; i++) {
				rowData.push(tableRow.cells[i].data || '');
			}

			return rowData;
		},
		/**
		 * @function - Gets a collection of data objects containing only the selected rows. Row data is an internally transformed object: {Object} tableRow
		 */
		getCheckedRows() {
			if (!this.showCheck) return [];

			if (this.tableData && populatedArray(this.tableData.rows)) {
				return this.tableData.rows.filter((row, index) => (index === 0 && this.headerInfirstRow) ? false : row.checked);
			}

			return [];
		},
		/**
		 * @function - Return whether all lines are selected
		 */
		isAllRowChecked() {
			if (!this.showCheck) return false;

			if (this.tableData && populatedArray(this.tableData.rows)) {
				return this.tableData.rows.every((row, index) => (index === 0 && this.headerInfirstRow) ? true : row.checked);
			}

			return false;
		},
		/**
		 * @function - Set all rows selected
		 * @param {Boolean} checked - true/false
		 */
		setAllRowChecked(checked) {
			if (this.tableData && populatedArray(this.tableData.rows)) {
				this.tableData.rows.forEach((row) => row.checked = !!checked);
			}
		},
		/**
		 * @function number - Number of lines currently displayed
		 */
		getActivatedRowNum(includeWhenHeaderInfirstRow = false) {
			if (this.tableData && populatedArray(this.tableData.rows)) {
				let num = 0;

				this.tableData.rows.forEach((row, index) => {
					if (index === 0 && this.headerInfirstRow) {
						if (!includeWhenHeaderInfirstRow) return;

						return num++;
					}

					if (row.show && !row.filtered) num++;
				});

				return num;
			}

			return 0;
		},
		/**
		 * @function - Exit quick peek
		 */
		exitQuickPeek() {
			this.quickPeekArr = [];
		},
		/**
		 * @function - Handle quick peek
		 */
		quickPeek(rowIndex) {
			this.quickPeekArr = [];
			this.sourceData.map(cur => {
				if (this.sourceData.indexOf(cur) === rowIndex) {
					this.quickPeekArr.push(cur);
				}
			});

			return rowIndex;
		},
		/**
		 * @function - Expand cell
		 */
		expandCell(event, rowIndex, cell, cellIndex) {
			const row = document.querySelector(`#table__row-${rowIndex}`);
			row.style.height = `${cell.data.length*40}px`;
			row.children[1].children[0].style.display = 'none';
			document.querySelector(`#table__cell-${cellIndex}`).style.overflowY = 'hidden';

			return;
		},
	},
	components: { 'table-input': Input, 'quick-peek': QuickPeek }
};
</script>

<style lang='scss' scoped>
@import './Table.scss';
</style>