// Test script để kiểm tra chức năng TOC scroll
// Chạy trong browser console khi đang ở trang HandBookDetail

function testTOCScroll() {
    console.log('=== Testing TOC Scroll Function ===');

    // Kiểm tra xem có TOC không
    const tocList = document.querySelector('.toc-list');
    if (!tocList) {
        console.error('❌ TOC list not found');
        return;
    }

    const tocItems = tocList.querySelectorAll('.toc-item');
    console.log(`✅ Found ${tocItems.length} TOC items`);

    // Kiểm tra từng TOC item
    tocItems.forEach((item, index) => {
        const link = item.querySelector('.toc-link');
        const text = link.textContent.trim();
        const sectionId = link.getAttribute('onclick')?.match(/section-\d+-[^)]+/)?.[0];

        console.log(`TOC Item ${index + 1}:`, {
            text,
            sectionId,
            element: document.getElementById(sectionId)
        });
    });

    // Kiểm tra các heading trong content
    const contentHtml = document.querySelector('.content-html');
    if (contentHtml) {
        const headings = contentHtml.querySelectorAll('h1, h2, h3, h4, h5, h6');
        console.log(`✅ Found ${headings.length} headings in content`);

        headings.forEach((heading, index) => {
            console.log(`Heading ${index + 1}:`, {
                tag: heading.tagName,
                text: heading.textContent.trim(),
                id: heading.id,
                className: heading.className
            });
        });
    }
}

// Chạy test
testTOCScroll();
