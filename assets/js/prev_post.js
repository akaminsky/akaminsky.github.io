/**
 * JS to get the previous and next post buttons to work
 */

$(function(){
      var NextPrevLinksModule = function(){
        var curr,
            $prevLink,
            $nextLink;
     
        return {
          init: function(){
            curr = $('#curr-post-uuid').html();
            $prevLink = $('.prev-post');
            $nextLink = $('.next-post');
     
            $prevLink.hide();
            $nextLink.hide();
     
            this.parseRss();
          },
          // creates previous and next links
          createLinks: function(items){
            for (var i = 0; i < items.length; i++){
              var uuid = $(items[i]).find('guid').text();
              if (uuid === curr){
                if (i < items.length-1){
                  $prevLink.attr('href', $(items[i+1]).find('link').text());
                  $prevLink.show();
                }
                if (i > 0){
                  $nextLink.attr('href', $(items[i-1]).find('link').text());
                  $nextLink.show();
                }
              }
            }
          },
          // iteratively parses rss feeds to generate posts object
          parseRss: function(page, items, lastId){
            self = this;
            page = page || 1;
            items = items || undefined;
            lastId = lastId || '';
            $.get('/rss/' + page, function(data){
              var posts = $(data).find('item');
              var currId;
              if (posts.length > 0) currId = $(posts[0]).find('guid').text();
     
              if (currId === lastId){
                // if this page has already been parsed, create links
                self.createLinks(items);
              } else {
                // if not, continue parsing posts
                items = items ? items.add(posts) : posts;
                lastId = currId;
                self.parseRss(page+1, items, lastId);
              }
            });
          }
        };
      }();
     
      NextPrevLinksModule.init();
    });
