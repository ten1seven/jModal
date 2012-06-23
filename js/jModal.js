/*
	jModal.js (a simple image and video modal)
	version 0.1
	(c) 2012 Jeremy Fields [jeremy.fields@viget.com]
	released under the MIT license
*/
(function(win,doc,undefine) {
	
	'use strict';
	
	win.jModal = function(breakpoints) {
		
		var init = function() {
		
			// do stuff here
			console.log('jmodal init');
			
			$('.jmodal').click(function(e) {
				e.preventDefault();
				
				var $this = $(this);
				
				($this.data('type') === 'image') ? loadImage($this,loadModal) : loadVideo($this,loadModal);
			});
		
		};
		
		
		/* image preloader
		========================================================================== */
		var loadImage = function(elm,callback) {
			var $this = elm;
			var img = document.createElement('img');
			
			img.onload = function() {
				callback(img,elm);
			};
			img.src = $this.attr('href');
		};
		
		
		/* video
		========================================================================== */
		var loadVideo = function(elm,callback) {
			
		};
		
		
		/* modal
		========================================================================== */
		var loadModal = function(elm,link) {
			
			// add modal markup to dom
			var $jmodal = $('<div id="jmodal-modal"><div class="jmodal-content"></div><a href="#" class="jmodal-close">X</a></div>').appendTo('body');
			BlockUI();
			
			addGalleryLinks(link);
			
			// append element to modal
			var $jmodalContent = $jmodal.find('.jmodal-content');
			$jmodalContent.append(elm);
			
			// measure container
			var height = $jmodal.outerHeight();
			var width = $jmodal.outerWidth();
			var imgHeight = $jmodalContent.height();
			var imgWidth = $jmodalContent.width();
			
			$jmodal.css({
				'height': imgHeight,
				'width': imgWidth
			});
			
			// position modal for animation
			$jmodal
				.css({
					'margin-left': ((width/2) * -1),
					'top': ((height * -1) - 20)
				})
				
				// animate in to vertical center
				.delay(300).animate({
					'top': (((height - $(window).height())/2) * -1)
				},200,function() {
					
					closeModal($jmodal);
					
					// reset css so modal stayes in vertical center
					$jmodal.css({
						'margin-top': ((height/2) * -1),
						'top': '50%'
					});
				});
		};
		var closeModal = function(modal) {
			var $jmodal = $(modal);
			var height = $jmodal.outerHeight();
			
			$('.jmodal-close, #UIBlock').click(function(e) {
				e.preventDefault();
				
				$jmodal
					// update css for animating out
					.css({
						'margin-top': 0,
						'top': $jmodal.offset().top
					})
					
					// animate
					.animate({
						'top': ((height * -1) - 20)
					},200,function() {
						$jmodal.remove();
						unBlockUI();
					});
			});
		};
		
		
		/* gallery
		========================================================================== */
		var addGalleryLinks = function(elm) {
			
			var galleryContent = '';
			if ($(elm).attr('rel')) {
				
				var i = 1;
				$('[rel=' + $(elm).attr('rel') + ']').each(function() {
					
					var selectedLink = ($(this).attr('href') === $(elm).attr('href')) ? 'selected' : '';
					galleryContent += '<li><a href="' + $(this).attr('href') + '" class="jmodal-gallery-link ' + selectedLink + '">' + i + '</a></li>';
					
					i++;
				});
				$('#jmodal-modal').addClass('jmodal-modal-gallery').append('<ol class="jmodal-gallery-links">' + galleryContent + '</ol>');
				
				bindGalleryLinks();
			}
		};
		var bindGalleryLinks = function() {
			$('.jmodal-gallery-link').click(function(e) {
				e.preventDefault();
				
				var $this = $(this);
				if (!$this.hasClass('selected')) {
					$('.jmodal-content img').animate({
						'opacity': 0
					},100);
					loadImage($this,dispGalleryImg);
				}
			});
		};
		var dispGalleryImg = function(img,link) {
			var $jmodal = $('#jmodal-modal');
			var $jmodalContent = $jmodal.find('.jmodal-content').empty();
			
			$('.jmodal-gallery-link.selected').removeClass('selected');
			$(link).addClass('selected');
			
			var $img = $(img);
			$img.appendTo($jmodalContent).css({
				'opacity': 0
			});
			
			var newHeight = $img.height();
			var newWidth = $img.width();
			
			$jmodal.animate({
				'height': newHeight,
				'margin-left': ((newWidth + 32)/2) * -1,
				'margin-top': ((newHeight + 86)/2) * -1,
				'width': newWidth
			},300,function() {
				$img.animate({
					'opacity': 1
				},300);
			});
		};
		
		
		/* ui block
		========================================================================== */
		var BlockUI = function() {
			if ($("#UIBlock").length === 0) {
				$('<div id="UIBlock" />').css({
					background: '#000',
					height: '100%',
					left: 0,
					opacity: 0,
					position: 'fixed',
					top: 0,
					width: '100%',
					zIndex: 900
				}).appendTo('body').animate({
					opacity: 0.8
				},100);
				if ($.browser.msie && ($.browser.version < 7)) {
					$('#UIBlock').css({
						position: 'absolute',
						top: $(window).scrollTop()
					});
				}
			}
		};
		var unBlockUI = function() {
			$('#UIBlock').fadeOut(100,function() {
				$(this).remove();
			});
		};
		
		init();
		
	};

}(this,this.document));