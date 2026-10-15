import urllib.request
import os

screens = [
    {
        'id': 'eb5aa4dd6c1349fb8c76303abe9d4df1',
        'slug': '01_overview_dashboard',
        'title': 'Overview Dashboard',
        'img': 'https://lh3.googleusercontent.com/aida/AEtjO1WIl7m9E6dg0xA-MWIOIREc5HNkKRqrDeODTrfi-LxOpTpX329YB3O4ta3DMakvBLHVI7d-DCxgepUsryccHHwb8GX7N0ihv-LjPNKeditYHFY8iKafBn9L6rq_vwDAvfBZc_rTBfADBUBFrvKCTYlzpiRdOZq-mXCm16WR60hERy9U9bt_w0iL2XFdXlO3kBKr4fIKid9PABmZ8_M89IiigqOCIOxjvjUrsyaf7lZmtvjKbMFEVSWlm_U',
        'html': 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1ZDkyNTRkZWRkNzkwNjM5NzQ4MzZiMjhkN2Q3EgsSBxC71eWrxQwYAZIBIwoKcHJvamVjdF9pZBIVQhM0NzM1Mzg1NjMxMzY5NTMwNDcy&filename=&opi=89354086'
    },
    {
        'id': '1962b74c79084df991902260deb6bde3',
        'slug': '02_brand_workspace',
        'title': 'Brand Workspace',
        'img': 'https://lh3.googleusercontent.com/aida/AEtjO1UTOOjL1QBjXRHbLAylsg2kvroQxtvLum7aQbESxgkewNXDte3AVIxSnYnBf8-LSkqBDUse-Nx_nqvX99DJSTxQ7xDMQzmY6wCAnCtPYgJPTYYnEJOWuh7umVb6s81taEh06uBKsnnxBRiP_C8JENo4SAEeeVdhLwjCXrLTWLxxQe1fVqUnYjJmq6k-pu2UMwtSEbHeqMNFdwW1ysnOU-qJHzhlab4Ux-m1X893-hAj8ZOUXjLr3WD6izk',
        'html': 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1ZDkyNWMzODNiOTYwMWE2MDgwYWZmM2QwYzcwEgsSBxC71eWrxQwYAZIBIwoKcHJvamVjdF9pZBIVQhM0NzM1Mzg1NjMxMzY5NTMwNDcy&filename=&opi=89354086'
    },
    {
        'id': '94c241cc40af4256aa2ba8a23be0bd9c',
        'slug': '03_knowledge_library',
        'title': 'Knowledge Library',
        'img': 'https://lh3.googleusercontent.com/aida/AEtjO1Vo3uVjquVdbolm9cWAeRXkjHK0zwfaoyjmOG9iPmJAPvxV0sBTHC2HSWxqDTAVjihMZjo2UEVwqE_ETOTRJ1sguO1LKJ9t05PrT9l56OrikhYbw8lPgSqvN_9rujGGNXduJGeUiOh0JsN9fVvw8FVrmL8scU53ZNobaZKSzp23PJJ5QFCAhK8KP1NKO9xu-LDXrZjIHHs1cV_ik4WbK_SzraN5wld_BMtstRgKvE4SMBxmTuj6Iy_9cfA',
        'html': 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1ZDkyNWIzMWY0OTkwMmE5OWZhOGZkMTIzMGI3EgsSBxC71eWrxQwYAZIBIwoKcHJvamVjdF9pZBIVQhM0NzM1Mzg1NjMxMzY5NTMwNDcy&filename=&opi=89354086'
    },
    {
        'id': 'fe3a58c26ea14c6fbeb90f4f08ad43ed',
        'slug': '04_content_studio',
        'title': 'Content Studio',
        'img': 'https://lh3.googleusercontent.com/aida/AEtjO1XOZWcKRSZJtVKDRi6I1dAr5zNWoC9spIZLRkrjjHHRObvKxEz8S6qKGDXK_L0T5iSD0un-mbAS-20b5kM-eSk_bVTM2BkU-9O4uxze0vyA_a1vkum1CCY_BqL69aYblyX7zLuLeRw53N_Y520phZPAIQZK8DI7sQ9Y0-4j1acih9M80XYeANxI3UsK2rekHHbZFn4BAKacEX6VPlwWQBlNy2Xcl_KVZGueD8kkqid86aSGcpN3Cf4LgHE',
        'html': 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1ZDkyNTU0ZDcwYzQwNTc2MzE3MmVkMTExM2YyEgsSBxC71eWrxQwYAZIBIwoKcHJvamVjdF9pZBIVQhM0NzM1Mzg1NjMxMzY5NTMwNDcy&filename=&opi=89354086'
    },
    {
        'id': 'f3a700e27cf4400cb26273046b597b0c',
        'slug': '05_retrieval_inspector',
        'title': 'Retrieval Inspector',
        'img': 'https://lh3.googleusercontent.com/aida/AEtjO1VZpEnyRGvY_Lw56-B4k6Lukj8GYn2UYt4uECiRd8xmnjUGXG8HNdiL69n0tsQadcwrnfRpt8GEFQrdpc-0CWvnCvpKH4rOPpAziGdyFiak8HIXDbq0NByH2hiUDwbY11uZMPbxzYJrptUQkSCnY3eloCYCvsfO-7pGhr6QbIKCvRy2S1IiZUEWvmbKWD4pom_P7rBhlK8h_vCetaKH8xc61CQEIKlGyE6qzVzdFQ4ca5cKtD6_skAcH5o',
        'html': 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1ZDkyNTVmZTdhYjAwN2M0ZDc3ZGI2MGMzY2UyEgsSBxC71eWrxQwYAZIBIwoKcHJvamVjdF9pZBIVQhM0NzM1Mzg1NjMxMzY5NTMwNDcy&filename=&opi=89354086'
    },
    {
        'id': 'f766e903aa364815a2900ba38e0dd07e',
        'slug': '06_evaluation_dashboard',
        'title': 'Evaluation Dashboard',
        'img': 'https://lh3.googleusercontent.com/aida/AEtjO1VU-bkoyBDYyK75_XkToILDCEDpqoMdmi9lmQaIG1LphqzIjjRv6D-621Pt3Yr4Rh2z-0EgOjexD4xUG71z_Jcea0eM0T4md62Pr3wG4QSC2k3hhTGtuZScCbqaqfy2R7mkGYW6K-I6KB2STjtv_lHorVn9s6xQK6m3CVygg5xLFTLaab5ipdxdrlDog_AoqeyD4Nlh-ZlRbmZKuUXBhjW-vavv8g5UQU7vtpnDcxG9efUKr7CXF6-snzQ',
        'html': 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1ZDkyNWI4MjY0YjYwNTIyYTM5YWRjMGFkZTVhEgsSBxC71eWrxQwYAZIBIwoKcHJvamVjdF9pZBIVQhM0NzM1Mzg1NjMxMzY5NTMwNDcy&filename=&opi=89354086'
    },
    {
        'id': '9a01836aa2bd486ca8705b40dd76fa43',
        'slug': '07_document_conflict_review',
        'title': 'Document Conflict Review',
        'img': 'https://lh3.googleusercontent.com/aida/AEtjO1Xfa8M7Nj-0sbvTPK9Hu_0Mn2tN7P7OOD85zrq5TBuHD0hRij_C1hHJEVfAueSWdsOnX0bnkQ-8xeAie_ZoaedXA29OkJ3GRGTy6J8rjtcfme5jehUNiqZ0AtSW1C3RG0K0rUh0NlsBjJc0uMK8n5UMSUDdJYg0vODjewljpdDfVHkHG0EUslIWHHi07mklZcK6iVCd3Lx--dsru7FbdvU3kgzlRr9J4ryfadcZEFna--012JXdhPj-Cg',
        'html': 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1ZDkyNTYxZGJjNzgwNjM5NzVjZDI0MWI4NmZiEgsSBxC71eWrxQwYAZIBIwoKcHJvamVjdF9pZBIVQhM0NzM1Mzg1NjMxMzY5NTMwNDcy&filename=&opi=89354086'
    }
]

os.makedirs('screens', exist_ok=True)
headers = {'User-Agent': 'Mozilla/5.0'}

for s in screens:
    img_path = os.path.join('screens', f"{s['slug']}.png")
    html_path = os.path.join('screens', f"{s['slug']}.html")
    
    print(f"Downloading {s['title']} ({s['id']})...")
    req_img = urllib.request.Request(s['img'], headers=headers)
    with urllib.request.urlopen(req_img) as resp, open(img_path, 'wb') as f:
        f.write(resp.read())
        
    req_html = urllib.request.Request(s['html'], headers=headers)
    with urllib.request.urlopen(req_html) as resp, open(html_path, 'wb') as f:
        f.write(resp.read())
        
    print(f"Saved {img_path} ({os.path.getsize(img_path)} bytes) and {html_path} ({os.path.getsize(html_path)} bytes)")

print("All 7 screens successfully downloaded!")
