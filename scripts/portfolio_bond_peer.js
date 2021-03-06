$(function(){
	var info = fng.fams.info,
        selectUnitFOpt = {
            selector : '#selectUnitFund',
            data : {
                '백만원':1000000,
                '억원':100000000
            }
        },
        $selectUnitFund;

    $selectUnitFund = fng.selectbox(selectUnitFOpt);

    //링크클릭 기본 이벤트 불능
    $('a', 'article').on('click', function(){
        return false;
    })

	//조회버튼 클릭
	$('#btn_read').click(function(){
        var param = {
            cust_cd:info.cust_cd,
            trd_dt:$('#trd_dt').val().replace(/-/g,''),
            unit:$selectUnitFund.val()
        }
        readFund(param);        
    });

    //종목내역조회 버튼
    function readData(fund_cd){
        var param = {
            cust_cd:info.cust_cd,
            trd_dt:$('#trd_dt').val().replace(/-/g,''),
            fund_cd:fund_cd,
            unit:$selectUnitFund.val()
        }
        readGrid(param, '110');
        readGrid(param, '120');
        readGrid(param, '130');
        readGrid(param, '210');
        readGrid(param, '220');
        readGrid(param, '310');
    }

    $('.tab').click(function(){
        var param = {
            cust_cd:info.cust_cd,
            trd_dt:$('#trd_dt').val()
        }
        $('.tab').removeClass('active');
        $(this).addClass('active');
        $('.tabdiv').hide();
        $('#' + $(this).attr('data-id') + 'Div').show();
        //readGrid(param, $(this).attr('data-id'));
    });

	function readFund(param) {
		var grdOpt,
        ajaxSettings;
        $('#fundGrid').html('');
        $('#fundGridpagearea').remove();
        function readSuccess(d){
        	//fng.debug.log(d);
            grdOpt = {
                selector:'#fundGrid',
                tableClass:'bdpeer-1',
                selectable: false,
                key: 'FUND_CD',
                header:[
                    [
                        {title:'펀드구분'},
                        {title:'상위펀드'},
                        {title:'펀드명'},
                        {title:'펀드유형'},
                        {title:'기준가'},
                        {title:'설정액'},
                        {title:'순자산'},
                        {title:'채권비중'},
                        {title:'주식비중'},
                        {title:'현금성'},
                        {title:'기타비중'}
                    ]
                ],
                body:[
                    {field:'FUND_GB'},
                    {field:'FUND_CD_SS', align:'left'},
                    {field:'FUND_NM', align:'left'},
                    {field:'PEER_NM', align:'right'},
                    {field:'STD_PRC', type:'number', align:'right'},
                    {field:'SET_AMT', type:'number', align:'right'},
                    {field:'NAV', type:'number', align:'right'},
                    {field:'BD_RT', type:'number', align:'right'},
                    {field:'ST_RT', type:'number', align:'right'},
                    {field:'CH_RT', type:'number', align:'right'},
                    {field:'ET_RT', type:'number', align:'right'}
                ],
                data:d,
                page:{
                    curPage:1,
                    line:10,
                    target:'#fundGridpagearea'
                },
                sort:{
                    sortable: true,
                    mode: 'single',
                    defaultOrd: 'asc'
                },
                callback: function(){
                    $('#fundGrid').off('click', 'table>tbody>tr').on('click', 'table>tbody>tr', function(){
                        $('table>tbody>tr','#fundGrid').removeClass('ac').removeClass('ac2');
                        $(this).addClass('ac2');
                        readData($(this).attr('data-key'));
                    });
                    $('#fundGrid>table>tbody>tr:first').click();
                }
            }

            fng.grid(grdOpt);
        }

        function readError(data, status, err){
            fng.debug.log(data.status).log(err);
        }

        function readDone(){
        }

fng.debug.log(param);
        ajaxSettings = {
            url: fng.fams.path + '/portfolio_fund_list_read.asp',
            param: param,
            success: readSuccess,
            error: readError,
            done: readDone
        }

        fng.ajax.getJson(ajaxSettings);
	}

	function readGrid(param, gb) {
        var grdOpt,
            ajaxSettings,
            gridNm = gb + 'Grid',
            pageNm = gridNm + 'pagearea',
            elmGrid,
            elmPage,
            tableClass = 'bdpeer-2',
            header,
            body;

        elmGrid = $('#' + gridNm);
        elmPage = $('#' + pageNm);

        elmGrid.html('');
        elmPage.remove();

        header = [
            [
                {title:'종목명'},
                {title:'평가액'},
                {title:'비중'},
                {title:'취득액'},
                {title:'평가손익'},
                {title:'잔존만기'}
            ]
        ];
        body = [
            {field:'ITEM_NM', align:'left'},
            {field:'MKT_EVAL_AMT', align:'right', type:'number'},
            {field:'WGT_NAV', align:'right', type:'number'},
            {field:'BUY_AMT', align:'right', type:'number'},
            {field:'EVAL_PL_AMT', align:'right', type:'number'},
            {field:'REMN_DAY', align:'right', type:'number'}
        ];

        function readSuccess(d){
            //fng.debug.log(d);
            grdOpt = {
                selector:'#' + gridNm,
                tableClass:tableClass,
                selectable: false,
                header:header,
                body:body,
                data:d,
                page:{
                    curPage:1,
                    line:5,
                    target:'#' + pageNm
                },
                sort:{
                    sortable: true,
                    mode: 'single',
                    defaultIdx: 0,
                    defaultOrd: 'asc'
                },
                callback: function(){
                }
            }

            fng.grid(grdOpt);
        }

        function readError(data, status, err){
            fng.debug.log(data.status).log(err);
        }

        function readDone(){
        }

        param.item_cd = gb;
        ajaxSettings = {
            url: fng.fams.path + '/portfolio_bond_peer_read.asp',
            param: param,
            success: readSuccess,
            error: readError,
            done: readDone
        }

        fng.ajax.getJson(ajaxSettings);
    }

    //fams전용 필요한 공통 호출
    //캘린더생성
    fng.fams.calendar();
    fng.fams.date.init();
})