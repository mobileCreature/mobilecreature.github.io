/*! (c) 2016 mobileCreature - GJSmith3rd - Gilbert Joseph Smith III (MIT) */
$(document).ready(function(){function e(e,t){function i(e){var t=e;o=t.data("image-id"),$("#image-gallery-caption").text(t.data("caption")),$("#image-gallery-title").text(t.data("title")),$("#image-gallery-image").attr("src",t.data("image")),$("#image-gallery-header").attr("href",t.data("url")),$("#image-gallery-body").attr("href",t.data("url")),a(n,t.data("image-id"))}var o,g,n=0;$("#show-next-image, #show-previous-image").click(function(){"show-previous-image"===$(this).attr("id")?o--:o++,g=$('[data-image-id="'+o+'"]'),i(g)}),e===!0&&$("[data-image-id]").each(function(){n++,$(this).attr("data-image-id",n)}),$(t).on("click",function(){i($(this))})}function a(e,a){$("#show-previous-image, #show-next-image").show(),e===a?$("#show-next-image").hide():1===a&&$("#show-previous-image").hide()}var t=!0;switch(!0){case/codepen/.test(location.hostname):$(".github").remove(),$(".adsense-github").remove(),$(".local").remove(),$.getScript("//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js");break;case/github/.test(location.hostname):$(".codepen").remove(),$(".adsense-codepen").remove(),$(".local").remove(),$.getScript("//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js");break;default:$(".codepen").remove(),$(".github").remove(),t?$(".adsense").remove():$.getScript("//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js")}e(!0,"a.thumbnail"),$(".navbar-nav li a").click(function(e){$(".navbar-collapse").collapse("hide")})});