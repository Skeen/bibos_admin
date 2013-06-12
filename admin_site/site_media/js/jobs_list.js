$(function(){
    var JobList = function(container_elem, template_container_id) {
        this.elem = $(container_elem)
        this.searchConditions = {}
        this.searchUrl = window.bibos_job_search_url || './search/'
        this.statusSelectors = []
        BibOS.addTemplate('job-entry', template_container_id);
    }
    $.extend(JobList.prototype, {
        init: function() {
            var jobsearch = this
            $('#jobsearch-status-selectors input:checkbox').change(function() {
                jobsearch.search();
            })
            jobsearch.search();
        },

        appendEntries: function(dataList) {
            var container = this.elem
            $.each(dataList, function() {
                var item = $(BibOS.expandTemplate('job-entry', this))
                item.find('.btn').popover()
                item.find('input:checkbox').click(function() {
                    $(this).parents('tr').toggleClass('marked');
                });
                item.appendTo(container)
            })
        },

        replaceEntries: function(dataList) {
            this.elem.find('tr.muted').remove()
            this.appendEntries(dataList)
        },

        selectFilter: function(field, elem, val) {
            var e = $(elem)
            if(e.hasClass('selected')) {
                e.removeClass('selected');
                val = ''
            } else {
                e.parent().find('li').removeClass('selected');
                e.addClass('selected');
            }
            $('#jobsearch-filterform input[name=' + field + ']').val(val)
            this.search()
        },

        selectBatch: function(elem, val) {
            this.selectFilter('batch', elem, val)
        },

        selectPC: function(elem, val) {
            this.selectFilter('pc', elem, val)
        },

        selectGroup: function(elem, val) {
            this.selectFilter('group', elem, val)
        },

        orderby: function(order) {
            var input = $('#jobsearch-filterform input[name=orderby]'),
                current = input.val(),
                desc = false,
                current_desc = false;
            if (current.match(/^\-/)) {
                current = current.replace(/^\-/, '')
                current_desc = true;
            }
            if (current == order)
                desc = !current_desc;
            input.val((desc ? '-' : '') + order)
            this.search()
        },

        search: function() {
            var js = this;
            js.searchConditions = $('#jobsearch-filterform').serialize()
            $.ajax({
                type: "POST",
                url: js.searchUrl,
                data: js.searchConditions,
                success: function(data) {
                    js.replaceEntries(data)
                },
                dataType: "json"
            });
        }
    });
    BibOS.JobList = new JobList('#job-list', '#jobitem-template');
    $(function() { BibOS.JobList.init() })
})